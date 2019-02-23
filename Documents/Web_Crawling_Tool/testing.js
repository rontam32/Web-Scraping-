const rp = require('request-promise');
const cheerio = require('cheerio');
async function crawlHTML() {
    try{
        const website = await rp('https://www.nike.com.hk/man/new_release/list.htm?intpromo=PNTP');
        const $ = cheerio.load(`${website}`);
        let nodeList = $('.product_list_content').text()
        let productName = Array.from(nodeList)
        console.log(nodeList)
        // for (i = 0; i < newProduct.length; i++) {
        //     productName.push(i.innerText)
        // }

        console.log(nodeList)
    }
    catch(err) {
        console.log(err)
    }
}

crawlHTML();