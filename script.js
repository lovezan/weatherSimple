const http = require("http");
const fs = require("fs");
var requests = require("requests");

const replaceval=(tempval,orgval)=>{
    let temperature = tempval.replace("{%tempval%}",orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgval.main.temp_max);
    temperature = temperature.replace("{%location%}",orgval.name);
    temperature = temperature.replace("{%country%}",orgval.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgval.weather[0].main);
    return temperature;
}

const homeFile = fs.readFileSync("home.html", "utf8");
const Server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=jammu&appid=eaad0bec5f4aab5bf8e5dca123ce88b6",
      
    )
      .on("data", (chunk)=> {
          const objdata = JSON.parse(chunk);
          const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeDate =arrData.map((val)=>
            // console.log(val.main)
            replaceval(homeFile,val)
        ).join("");
        res.write(realTimeDate);
        // console.log(realTimeDate);
      })
      .on("end", (err)=> {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

Server.listen(8000,"127.0.0.1");