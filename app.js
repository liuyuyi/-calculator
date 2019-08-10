const mongoose = require('./db/mongooseDb')
const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const targetUrl = 'https://m.cnal.com/market/changjiang/';
// 截取网页生成图
const puppeteer = require('puppeteer');
// 创建一个SMTP客户端配置
const config = {
    host: 'smtp.163.com', //网易163邮箱 smtp.163.com
    port: 25, //网易邮箱端口 25
    auth: {
        user: 'yuyi.style@163.com', //邮箱账号
        pass: 'liuyuyi1989' //邮箱的授权码
    }
};
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);
// 创建一个邮件对象
var mail = {
    // 发件人
    from: 'yuyi<yuyi.style@163.com>',
    // 主题
    subject: '铜铝价格',
    // 收件人
    to: '339266478@qq.com,328826649@qq.com',
    // 邮件内容，HTML格式
    html: '<table class="table" style="border: 1px solid rgb(153, 153, 153);"><tbody><tr><td>序号</td> <td>规格</td> <td>加工费<br>CCAQA-1/155</td> <td>当日铜价</td> <td>当日铝价</td> <td>当日含税价单价</td> <td>当日不含税单价</td></tr> <tr class="item"><td>1</td> <td style="white-space: nowrap;">0.10-0.11</td> <td>26.16</td> <td rowspan="10" style="background: rgb(161, 216, 252);">46.7</td> <td rowspan="10" style="background: rgb(197, 161, 252);">13.94</td> <td>49.93</td> <td>46.23</td></tr><tr class="item"><td>2</td> <td style="white-space: nowrap;">0.12-0.13</td> <td>24.11</td> <td rowspan="10" style="background: rgb(161, 216, 252); display: none;">46.7</td> <td rowspan="10" style="background: rgb(197, 161, 252); display: none;">13.94</td> <td>47.88</td> <td>44.33</td></tr><tr class="item"><td>3</td> <td style="white-space: nowrap;">0.14-0.15</td> <td>18.56</td> <td rowspan="10" style="background: rgb(161, 216, 252); display: none;">46.7</td> <td rowspan="10" style="background: rgb(197, 161, 252); display: none;">13.94</td> <td>42.33</td> <td>39.19</td></tr><tr class="item"><td>4</td> <td style="white-space: nowrap;">0.16-0.17</td> <td>17.31</td> <td rowspan="10" style="background: rgb(161, 216, 252); display: none;">46.7</td> <td rowspan="10" style="background: rgb(197, 161, 252); display: none;">13.94</td> <td>41.08</td> <td>38.04</td></tr><tr class="item"><td>6</td> <td style="white-space: nowrap;">0.18-0.19</td> <td>16.76</td> <td rowspan="10" style="background: rgb(161, 216, 252); display: none;">46.7</td> <td rowspan="10" style="background: rgb(197, 161, 252); display: none;">13.94</td> <td>40.53</td> <td>37.53</td></tr><tr class="item"><td>7</td> <td style="white-space: nowrap;">0.20-0.24</td> <td>13.83</td> <td rowspan="10" style="background: rgb(161, 216, 252); display: none;">46.7</td> <td rowspan="10" style="background: rgb(197, 161, 252); display: none;">13.94</td> <td>37.60</td> <td>34.81</td></tr><tr class="item"><td>8</td> <td style="white-space: nowrap;">0.25-0.29</td> <td>13.33</td> <td rowspan="10" style="background: rgb(161, 216, 252); display: none;">46.7</td> <td rowspan="10" style="background: rgb(197, 161, 252); display: none;">13.94</td> <td>37.10</td> <td>34.35</td></tr><tr class="item"><td>9</td> <td style="white-space: nowrap;">0.30-0.39</td> <td>13.26</td> <td rowspan="10" style="background: rgb(161, 216, 252); display: none;">46.7</td> <td rowspan="10" style="background: rgb(197, 161, 252); display: none;">13.94</td> <td>37.03</td> <td>34.29</td></tr><tr class="item"><td>10</td> <td style="white-space: nowrap;">0.40-0.49</td> <td>12.8</td> <td rowspan="10" style="background: rgb(161, 216, 252); display: none;">46.7</td> <td rowspan="10" style="background: rgb(197, 161, 252); display: none;">13.94</td> <td>36.57</td> <td>33.86</td></tr><tr class="item"><td>11</td> <td style="white-space: nowrap;">0.50-1.30</td> <td>12.4</td> <td rowspan="10" style="background: rgb(161, 216, 252); display: none;">46.7</td> <td rowspan="10" style="background: rgb(197, 161, 252); display: none;">13.94</td> <td>36.17</td> <td>33.49</td></tr></tbody></table>' //可以是链接，也可以是验证码
};
/*  数据库连接  */
const PriceSchema = {
    toPrice: { // 铜
        type: Number
    },
    lvPrice: { // 铝
        type: Number
    },
    upDateTime: { type: String },
    creatDate: { type: Number }
}
const PriceModel = mongoose.model('newprice', PriceSchema);
const Rule2 = new schedule.RecurrenceRule();
    Rule2.hour = [16];
    Rule2.minute = [32];

schedule.scheduleJob(Rule2,  () =>{

    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(targetUrl);
        await page.screenshot({
            path: 'example.jpg'
        });
        await browser.close();
    })();

    https.get(targetUrl, (res) => {

        var html = ''; // 保存抓取到的 HTML 源码

        res.setEncoding('utf-8');

        // 抓取页面内容
        res.on('data',  (chunk) =>{
            console.log(chunk)
            html += chunk;
        });

        res.on('end',  () =>{

            var $ = cheerio.load(html),
                priceData = {
                    creatDate: new Date().getTime()
                };

            for (var i = 0, len = $('.cnal-market-table td').length; i < len; i++) {
                var type = $($('.cnal-market-table td')[i]).text(),
                    $parent = $($('.cnal-market-table td')[i]).parent();
                if (type === '铝') {
                    console.log('铝' + $($parent.find('td')[2]).text())
                    priceData.lvPrice = $($parent.find('td')[2]).text()*1;
                    priceData.upDateTime = $($parent.find('td')[4]).text();
                } else if (type === '铜') {
                    console.log('铜' + $($parent.find('td')[2]).text())
                    priceData.toPrice = $($parent.find('td')[2]).text() * 1;
                }
            }
            
            PriceModel.findOne({
                upDateTime: priceData.upDateTime
            }, function (err, doc) {
                
                if(doc === null){

                    var price = new PriceModel(priceData);
                    price.save();

                }else{
                    console.log('已经存在不保存')
                }

            });

        });

    }).on('error', function (err) {
        console.log(err);
    });

});

// 发送邮件
function send(mail) {
    transporter.sendMail(mail, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};
send(mail);

app.use('/public', express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/" + "index.html");
});
app.get('/getPrice', (req, res) => {
    console.log(req.query.time)
    PriceModel.findOne({
        creatDate: {
            $lte: req.query.time
        }
    }, function (err, doc) {
        res.end(JSON.stringify(doc));
    });
});

var server = app.listen(3000,  () =>{

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});