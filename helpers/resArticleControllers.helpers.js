const notFound = (articles, res) => {
    if(articles.length === 0) {
        return res.status(400).json({
            ok: true,
            msg: 'There are no articles for that search'
        });          
    }
}

const found = (articles, res) => {
    return res.status(200).json({
        ok: true,
        amount: articles.length,
        articles
    });
}

module.exports = {
    notFound,
    found    
}
