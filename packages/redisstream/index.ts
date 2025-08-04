import { createClient } from "redis";

const client = await createClient()
  .on("error", (error) => {
    console.log(error);
  })
  .connect();

type websiteEvent = { url: string; id: string };
const STREAM_NAME = "betteruptime:website";
type messageType = { id: string; message: { url: string; id: string } };

async function xAdd({ url, id }: websiteEvent) {
  await client.xAdd(STREAM_NAME, "*", {
    url,
    id,
  });
}

export async function xAddBulk(websites: websiteEvent[]) {
  for (let i = 0; i < websites.length; i++) {
    const website = websites[i];
    if (website) {
      await xAdd({
        url: website.url,
        id: website.id,
      });
    }
  }
}

export async function xReadGroup(
  consumerGroup: string,
  workerId: string
): Promise<messageType[] | undefined> {
  const res = await client.xReadGroup(
    consumerGroup,
    workerId,
    {
      key: STREAM_NAME,
      id: ">",
    },
    {
      COUNT: 5,
    }
  );
  // @ts-ignore
  const messages: messageType[] | undefined = res?.[0]?.messages ?? [];
  return messages;
}

export async function xAck(consumerGroup: string, eventId: string) {
  await client.xAck(STREAM_NAME, consumerGroup, eventId);
}

export async function xAckBulk(consumerGroup: string, eventIds: string[]) {
  eventIds.map((eventId) => xAck(consumerGroup, eventId));
}

export async function xCreateGroup(consumerGroup: string) {
  try {
    await client.xGroupCreate(STREAM_NAME, consumerGroup, "$", {
      MKSTREAM: true
    });
    console.log(`Redis consumer group '${consumerGroup}' created successfully`);
  } catch (error: any) {
    if (error.message.includes("BUSYGROUP")) {
      console.log(`Redis consumer group '${consumerGroup}' already exists`);
    } else {
      throw error;
    }
  }
}