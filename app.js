const express = require('express');
const app=express();
const path = require('path');
const PORT = process.env.PORT || 5000;
const axios = require("axios");
const cheerio = require("cheerio");
const { convert } = require('html-to-text');
const bodyParser = require('body-parser');
app.use(express.json());
app.use('/', express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.post('/api/results', async (req, res) => {
    try{
        const { url } = req.body
        const { pageData } = await axios.get(url);
        const $ = cheerio.load(pageData);
        const tabl = $(".table-responsive table tbody tr");
        const data={results: []};
            tabl.each(function(idx, el){
                    const row= $(el).children("td");
                    const arr=[];
                    row.each(function(idx, el2){
                        var temp=$(el2).html().replace(/(\r\n|\n|\r)/gm, "").replace(/(\r\t|\t|\r)/gm, "");
                        if(temp.trim().length!=0){
                            arr.push(temp);		
                        }			
                    });
                    var i1=arr[1].indexOf("title=\"",arr[1].indexOf("fa fa-comments"))+7;
                    var i2=arr[1].indexOf("\"",i1+2);
                    const title=arr[1].substring(i1,i2);
                    var i1=arr[0].indexOf("title=\"")+7;
                    const dl="http://nyaa.si"+arr[2].substring(9,arr[2].indexOf("\"",11));
                    const ml=arr[2].substring(arr[2].indexOf("magnet:"),arr[2].indexOf("\"",arr[2].indexOf("magnet:")+11));
                    const size=arr[3];
                    const dateAdded=arr[4];
                    const seeds=arr[5];
                    const leechers=arr[6];
                    const result={title: title,	dlink: dl,mlink: ml,size: size,dateAdded: dateAdded,seeders: seeds,leechers: leechers};
                    data.results.push(result);
            });
            console.log(data.results.length+" results fetched");
            res.json({ status: 'ok', data: data });
            console.log("response sent")
        }catch (e) {
            console.error(e);
            res.json({status: 'error'});
        }
});
app.post('/api/torrentData',async (req,res)=>{
    try{
        const {url}=req.body;
        const { pageData } = await axios.get(url);
        const $ = cheerio.load(pageData);
        const html = $('#torrent-description').html();
        const text = convert(html);
        res.json({status:'ok', description: text})
        }
        catch (e) {
            console.error(e);
            res.json({status:'error'})
        }
})
app.listen(process.env.PORT || PORT, () => {
	console.log("listening "+PORT+"...");
});