import { client } from "store/client";
import { xAddBulk} from "redisstream/client";



async function main(){
    const websites = await client.website.findMany();

    console.log(websites.length);
    await xAddBulk(websites.map((w) => ({ url: w.url, id: w.id })));
}

setInterval(() => {
  main();
}, 3 * 1000)