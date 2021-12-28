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
        console.log(req.body)
        const { query,sortBy,order } = req.body
        var url=null;
        const nquery=query.replace(/\s+/g,'+');
        if(sortBy)
        url="https://nyaa.si/?f=0&c=0_0&q="+nquery+"&s="+sortBy+"&o="+order;
        else
        url="https://nyaa.si/?f=0&c=0_0&q="+nquery
        const { data } = await axios.get(url);
	    const $ = cheerio.load(data);
        const tabl = $(".table-responsive table tbody tr");
        const fetched={results: []};
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
                    const id=dl.substring(dl.indexOf("download")+9,dl.indexOf(".torrent"))
                    const result={id:id,title: title,	dlink: dl,mlink: ml,size: size,dateAdded: dateAdded,seeders: seeds,leechers: leechers};
                    fetched.results.push(result);
            });
            console.log(fetched.results.length+" results fetched");
            res.json({ status: 'ok', data: fetched.results });
            console.log("response sent")
        }catch (e) {
            console.error(e);
            res.json({status: 'error'});
        }
});
app.post('/api/torrentData',async (req,res)=>{
    try{
        const {id}=req.body;
        
        const url="https://nyaa.si/view/"+id;
        const { data } = await axios.get(url);
	    const $ = cheerio.load(data);
        var html = $('#torrent-description').html();
        const text = convert(html);
       
        res.json({status:'ok', description: text})
        console.log("response sent")
        }
        catch (e) {
            console.error(e);
            res.json({status:'error'})
        }
})
app.listen(process.env.PORT || PORT, () => {
	console.log("listening "+PORT+"...");
});
async function test(){

const url="https://nyaa.si/view/1468972"
        const { data } = await axios.get(url);
	    const $ = cheerio.load(data);
        var html = $('#torrent-description').html();
        const text = convert(html);
        var txt = $('#collapse-comments').contents().map(function() {
                if($(this).html()){
                const user=$(this).find('div[title="User]').text()
                const comment=$(this).find('div[class="comment-content"]').text();
                return {user,comment};
                }
        }).get()
        
        console.log(txt)       
}
test();