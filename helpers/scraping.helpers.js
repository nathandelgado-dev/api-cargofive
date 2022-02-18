const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const fetch = require('node-fetch');

/*
Get articles from https://cargofive.com/
url = url of category to scrap
amount = amount of articles that you want to get
*/
const scrapingGetArticles = async(url, amount) => {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const totalArticles = [];
    const container = $('div .posts-container').find('article').toArray();

    $(container).each(function (i, elem) {
    let categoryArr = []
    $(elem).find('.meta-category').find('a').each((i, elem) => {
                categoryArr[i] = $(elem).attr('class');
    });
    let title = $(elem).find('h3[class=title]>a').text()
    .replace(/(\t)/g, '');
    let source = $(elem).find('h3[class=title]>a').attr('href');
    let description = $(elem).find('.excerpt').text();
    let author = $(elem).find('.grav-wrap .text a').text();
    let publishedAt = $(elem).find('.grav-wrap .text span').text();
    let category = categoryArr;
            
    totalArticles[i] = {
    title,
    description,
    author,
    publishedAt,
    category,
    source
    };
    });
    const result = totalArticles.slice(0, amount);
    return result;
}

module.exports = {
    scrapingGetArticles
}