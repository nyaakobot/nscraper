#nscraper
nyaa.si scraper API


#Request body must include -      
query: your search query,
Optional parameters -
sortBy: ```"Seeders"```/```"Size"```) if null default sorting order is used (Date),
order: ```"asc"```/```"desc"``` if null "desc".

#Response Format

```{id:id,title: title,dlink: downloadlink,mlink: magnetlink,size: size,dateAdded: dateAdded,seeders: seeds,leechers: leechers}```
