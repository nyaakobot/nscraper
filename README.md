# nscraper
nyaa.si scraper API


##Request Format

           ```method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,sortBy,order
            })```
            
query: your search query
sortBy: sorting order ("Seeders"/"Size") if null default sorting order is used (Date)
order: "asc"/"desc" if null "desc"

##Response Format
{id:id,title: title,	dlink: downloadlink,mlink: magnetlink,size: size,dateAdded: dateAdded,seeders: seeds,leechers: leechers}
