// const mongoose = require('./db/mongooseDb')
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
// 创建一个SMTP客户端配置  xhodgaqyxlcebibg
const config = {
    host: 'smtp.qq.com', //网易163邮箱 smtp.163.com
    port: 465, //网易邮箱端口 25
    auth: {
        user: '339266478@qq.com', //邮箱账号
        pass: 'xhodgaqyxlcebibg' //邮箱的授权码
    }
};
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);
// 创建一个邮件对象
var mail = {
    // 发件人
    from: '<339266478@qq.com>',
    // 主题
    subject: '铜铝价格',
    // 收件人
    to: '328826649@qq.com',
    cc: '339266478@qq.com',
    // 邮件内容，HTML格式
    html: 'sdadsasda'
};
var listData = [{id: 1, size: '0.10-0.11', addMuch: 26.16},
{ id: 2, size: '0.12-0.13', addMuch: 24.11 },
{ id: 3, size: '0.14-0.15', addMuch: 18.56 },
{ id: 4, size: '0.16-0.17', addMuch: 17.31 },
{ id: 6, size: '0.18-0.19', addMuch: 16.76 },
{ id: 7, size: '0.20-0.24', addMuch: 13.83 },
{ id: 8, size: '0.25-0.29', addMuch: 13.33 },
{ id: 9, size: '0.30-0.39', addMuch: 13.26 },
{ id: 10, size: '0.40-0.49', addMuch: 12.80 },
{ id: 11, size: '0.50-1.30', addMuch: 12.40 }];
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
// const PriceModel = mongoose.model('newprice', PriceSchema);
const Rule2 = new schedule.RecurrenceRule();
    Rule2.hour = [10,11,12];
    Rule2.minute = [00,30];

schedule.scheduleJob(Rule2,  () =>{

    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(targetUrl);
        await page.screenshot({
            path: './public/images/example.jpg'
        });
        await browser.close();
    })();

    https.get(targetUrl, (res) => {

        var html = ''; // 保存抓取到的 HTML 源码

        res.setEncoding('utf-8');

        // 抓取页面内容
        res.on('data',  (chunk) =>{
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
                    priceData.lvPrice = $($parent.find('td')[2]).text()*1/1000;
                    priceData.upDateTime = $($parent.find('td')[4]).text();
                } else if (type === '铜') {
                    console.log('铜' + $($parent.find('td')[2]).text())
                    priceData.toPrice = $($parent.find('td')[2]).text() * 1/1000;
                }
            }

            var shtml = '<p style="font-size:20px;font-weight:bold;padding:0px;margin:0px;">当前\
                <span style="color:blue;">铝</span>价格：\
                <span style="color:red;">' + priceData.lvPrice + '</span></p>\
                <p style="font-size:20px;font-weight:bold;padding:0px;margin:0px;"> 当前\
                <span style="color:green;">铜</span>价格： \
                <span style="color:red;">' + priceData.toPrice + '</span></p> \
                <p>截图如下:</p>\
                <p><img src="cid:img1"></p>\
                <table class="table" style="border: 1px solid #999999;">\
                    <tr>\
                    <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">序号</td>\
                    <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">规格</td>\
                    <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">加工费<br/>CCAQA-1/155</td>\
                    <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">当日铜价</td>\
                    <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">当日铝价</td>\
                    <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">当日含税价单价</td>\
                    <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">当日不含税单价</td>\
                </tr>';

            for(var e=0,elen=listData.length;e<elen;e++){

                var item = listData[e],
                    colHtml = '<td rowspan="10" style="background: #a1d8fc;">'+priceData.toPrice+'</td>\
                    <td rowspan="10" style="background: #c5a1fc;">'+ priceData.lvPrice +'</td>';

                shtml += '<tr v-for="(item, index) in listData" :key="item.id" class="item">\
                            <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">'+ item.id + '</td>\
                            <td style="white-space: nowrap;	padding: 6px 3px;text-align: center;border: 1px solid #999999;">'+item.size +'</td>\
                            <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">'+ item.addMuch + '</td>\
                            '+ (e === 0 ? colHtml : '') +'\
                            <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">'+ ((priceData.toPrice*0.3)+(priceData.lvPrice*0.7)+item.addMuch).toFixed(2) +'</td>\
                            <td style="	padding: 6px 3px;text-align: center;border: 1px solid #999999;">'+ (((priceData.toPrice*0.3)+(priceData.lvPrice*0.7)+item.addMuch)/1.08).toFixed(2) +'</td>\
                        </tr>'

            }
            shtml += '</table>';

            mail.html = shtml;
            mail.subject = priceData.upDateTime + '铜铝价格';
            // 伪代码
            var img = fs.readFileSync('./public/images/example.jpg')
            mail.attachments =  [{
                filename: '实时价格网站截图',
                content: img,
                cid: 'img1'
            }]
            
            send(mail);

            // PriceModel.findOne({
            //     upDateTime: priceData.upDateTime
            // },  (err, doc) =>{
                
            //     if(doc === null){

            //         var price = new PriceModel(priceData);
            //         price.save();

            //     }else{
            //         console.log('已经存在不保存')
            //     }

            // });

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

var server = app.listen(3000, () =>{

    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});