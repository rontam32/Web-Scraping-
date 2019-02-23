const rp = require('request-promise');
const cheerio = require('cheerio');
const tough = require('tough-cookie');
const S = require('string')

async function retreieveProductInfo(gender, category, subCategory) {
    try{
        let domain_web = 'https://www.nike.com.hk'
        const website = await rp(`${domain_web}/${gender}/${category}/${subCategory}/list.htm?locale=en-gb`, {withCredentials: true});
        const $ = cheerio.load(`${website}`);        
        let product_list = [];
        $(".origin_price").remove()          
        let productInfo = $('.product_list_name').text()
        let productPrice = $('.color666').text()       
        let product_String = S(productInfo).collapseWhitespace().s
        let product_price = S(productPrice).collapseWhitespace().s
        let productWord_array = S(product_String).splitLeft(' ')        
        let product_name, extraWord, categoryWord, price
        product_name = extraWord = categoryWord = price = ""        
        let price_list = []
        for (let r in product_price) {
            //console.log(product_price.length)
            if ((product_price[r] ==="H")) {
                price_list.push(price)
                price = ""
            }
            price += product_price[r]
            if (r ==(product_price.length - 1)) {
                price_list.push(price)
            }
        }
        let sanitized_price_list = []
        for (let t in price_list) {
            let new_price = S(price_list[t]).strip("H", "K", "$", ",").s
            sanitized_price_list.push(Number(new_price))
        }
        sanitized_price_list = sanitized_price_list.slice(1)
     
        for (let i in productWord_array) {                       
            //product word contains category wordings
            if ((productWord_array[i].includes('Shoe'))||(productWord_array[i].includes('Men'))||(productWord_array[i].includes('Women'))||(productWord_array[i].includes('Boy'))||(productWord_array[i].includes('Girl'))) {
                let shoes = ["Shoe", "Men's", "Women's", "Boy's", "Girl's"];                    
                for (let shoe in shoes) {
                    s = productWord_array[i].indexOf(shoes[shoe])
                    //if category wording matches
                    if (s !== -1) {
                        extraWord = productWord_array[i].slice(0, s)
                        product_name += extraWord
                        categoryWord += productWord_array[i].slice(s) + " "                        
                    }                                        
                                    
                }     
                //If category wording is completed (with the word 'shoe'), then push name and category
                if (categoryWord.includes('Shoe')) {                    
                    product_list.push({
                            name: product_name.trim(),
                            category: categoryWord.trim()
                        })
                    product_name = ""
                }         
                
            }
            else {                
                product_name += productWord_array[i] + " " 
                extraWord = ""
                categoryWord = ""
            }            
        }
        for (let a in product_list) {
            product_list[a].price = sanitized_price_list[a]
        }
    }
    catch(err) {
        console.log("Error", err)
    }
}

retreieveProductInfo("man", "shoe", "running");