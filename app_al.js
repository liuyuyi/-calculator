// const mongoose = require("./db/mongooseDb");
// const express = require("express");
// const app = express();
// const https = require("https");
const fs = require("fs");
// const path = require('path');
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const targetUrl = "https://detail.1688.com/offer/570454713061.html?spm=a261y.7663282.hotsale.3.3fa6555esbZ8On";
const puppeteer = require("puppeteer");

const axios = require('axios');
const request = require('request');

var Bagpipe = require('bagpipe');

const fileDownload = require('./filedownload');

const pic = [
    'https://cbu01.alicdn.com/img/ibank/2019/228/700/10985007822_1896385090.60x60.jpg',
    'https://cbu01.alicdn.com/img/ibank/2018/411/784/8949487114_1896385090.60x60.jpg',
    'https://cbu01.alicdn.com/img/ibank/2018/744/666/8932666447_1896385090.60x60.jpg',
    'https://cbu01.alicdn.com/img/ibank/2018/780/122/8991221087_1896385090.60x60.jpg'
];


function douwnpic(arr) {
    
    for(var i=0,len=arr.length;i<len;i++){

        var src = arr[i];

        ;(async (src) => {
           console.log(src)
            try {
                let url = src.replace(/.60X60/ig, '');
                console.log(url)
                let opts = {
                    url: url,
                };
                let path = url.match(/\/([^/]*)$/)[1];
                let r1 = await fileDownload.downImg(opts, path);
            } catch (e) {
            }
        })(src);


    }

}

// return
(async () => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(targetUrl);
    await page.screenshot({
        path: "./public/images/example.jpg",
        clip: {
            x: 0,
            y: 0,
            width: 1920,
            height: 1200
        }
    });
    await browser.close();
    douwnpic(pic);
    return;
    axios({
            method: 'get',
            url: targetUrl,
            data:{
                // appkey: '81355e0ec04e9f3fcb7ced700bceb518',
// uid: 'tangyuanyuan19821027',
                // APIVersion: '0.6.0',
                // client: 'pc',
                // env: 'online',
                // ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                // shopId: 'tangyuanyuan19821027',
                // topicKey: 'moduleJsLoad',
                // log: {"depsSrc":"//g.alicdn.com/??code/npm/rat-overlay/0.1.27/index.web.cmd.js,code/npm/rat-message/0.1.27/index.web.cmd.js","moduleSrc":"//g.alicdn.com/cbumod/cbu-pc-wp_pc_common_header/0.0.22/index.web.js","success":true,"time":970}
            },
            headers:{
                // 'Content-Type': 'application/json',
                'Cookie': 'cna=YUCIGKATXBwCAXd7OEquknND; UM_distinctid=1773d24e6ef88b-05cb2a658b553f-376b4502-1fa400-1773d24e6f07f6; taklid=46b62e82740b4e559bc5b565e0a8534d; ali_ab=119.123.56.51.1612418447488.5; ali_apache_id=11.186.201.1.1613783607380.403240.2; __utmz=62251820.1621927190.1.1.utmcsr=app.1688.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utma=62251820.1271804777.1621927190.1621927190.1621933552.2; 992605435_lego_inform_timestamp=1623986094921; hng=CN%7Czh-CN%7CCNY%7C156; h_keys="%u4e1c%u839e%u6052%u6d0b#%u4e1c%u839e%u6052%u6d0b%u7535%u5de5#%u6f06%u5305%u7ebf"; ad_prefer="2021/06/24 09:37:07"; cookie2=1ed0908767dbab4140483f701925f29a; t=f935117b3c5a95d7a87429e9b9ac9bb5; _tb_token_=5eebef51b5430; xlly_s=1; cookie1=VT23tV5vHtH6t85ggO8rIMXJ%2Fvy53sOWIoNfbxqeXR4%3D; cookie17=WvmGQ%2BldddOE; sg=75f; csg=9e57eb3a; lid=tangyuanyuan19821027; unb=992605435; uc4=id4=0%40WD5gIPStvJInTlYs4Hn6lFoM4G4%3D&nk4=0%40FY0dftwnlkLVKYIMKm%2BBV3fBWShf2oo8aPlzhZuhUg%3D%3D; __cn_logon__=true; __cn_logon_id__=tangyuanyuan19821027; ali_apache_track=c_mid=tangyuanyuan19821027|c_lid=tangyuanyuan19821027|c_ms=2|c_mt=2; ali_apache_tracktmp=c_w_signed=Y; _nk_=tangyuanyuan19821027; last_mid=tangyuanyuan19821027; _csrf_token=1624586236314; _is_show_loginId_change_block_=tangyuanyuan19821027_false; _show_force_unbind_div_=tangyuanyuan19821027_false; _show_sys_unbind_div_=tangyuanyuan19821027_false; _show_user_unbind_div_=tangyuanyuan19821027_false; __rn_alert__=false; _m_h5_tk=177549ef881486043344b97bc20cae4d_1624595599096; _m_h5_tk_enc=9064a1c65b24182ab97208bbba99d47b; EGG_SESS=iEvE3ZwE9m0N0MqOrfAGBAfv3vYAwq0Rs4GqUKZIY1WM-kVmAxHsAIPtBl7XV5ZAgZgl4tjQGIhr0Gz6g5Q888APehpL5vrMM4yXS1pVz9n6jb4mxlIcRZr4ENUo0-4I0pYhMKBFl1b1q29Gw3eOKjDLAbF4KnNc3Dwc8WFoP3-QyrTq8trsC3jYGXIoE07enUFGN5hsib5Byp9kOWpZ7QRcKzaFFDLvD1IzC1PEQE5c35cxvo-165cs4X5t5ZWPqTJlkIN4RZ7jUn9OReL_839kRY1lQykdsgJZeRjuDDwPjWx5nBBMYChpcR99CyC4ph8cMRklXuIk-Vhcmw2ppfeLnn_TEi1cIHgiGOy52jm1oeBTj3yLpHx6i9Nubq6KBFSE0PI314t6QHbh-Owgb3DV4B4AbxQo1maE3TZ6tZ9nTlTHZY7p5mxXtMcge4yCxmQLW13KRt0FD0u8fE58OBsSEqG1X79cp5EUlaHGmn37VIGF6gfzC3OaA5Jx28Z3yU7XqV3eP4PFELA17ZMpC2x2_EoQBWsLn_bDXevwDZzKfgWnwf9ywuBaVGGmoJJ8pPftIlijjKrbM43V4d_Vcr0IuROsT6TMNVU54YLrAVLW9FL3RWeMHO9OmyvPLTlh-jDpkn_0HrLCJUmZ3MD8gCXymuiyEx2b7V4PyR1TCXycmQjiC73s4OzDFVgRvUHZdppphMHnr41SyHXFvLigUOWFPgbMtZ7LuNwCz8tQOyoBSO5Kzqe4CQmxtVa9YuSQLSfiOMmSRXuae0jbHg5w9jckj5ngYhjuAZ2egXwmhY_JqsZV6xFRzYbS9WhhWnvS8j9tA5e3FUe0E1I1IqRStm6CDdFotLbd-nOREBxrVry_J7U9Tu5zqAxB4SFw35HHf0u1NIllxdVDC6MLAomd7wThVD9GoFc00sZwSfaOvDToGKXSKaq0uBk4ot_4Bhyc8lzHCW7uT9VBCn77rDKwqAatmFED3HfQOFYAXkscfYSX5_NOpzligS2C2nQwMASP2r0XL05kK-g9aGyTAPDvnjZm-O6ThXpXlFthWb5Qs8BrJi_qQ0QbhEPfhc3tuUu8JcdyjLyHnYcLxTs1wQxivLX6HlDYhNZBzELdYDb1utQfRbBY1gRii6Od5B8LYJEh8l8rkGGQkN3G6hAeYq7SxfMvrvnnsN5aIebmC4Jai3TQQaBQcDygos5_4hYgtEt0437BEfYZvFILz9lwTDYUOST33QmXaZ_p-iHoA_lQqhD3a1swc-8b8kLCDufdIkfG_889CrygdqpS45Hm0nDTlAUprEfNkXL3CRw9y7Q-OfiOC0-OoF0hlYhojrzqpFBR7gri0ysHAO6U5pVLZ05ByqtSgzhc1A-3MjJ2kUdgw9OoX-RoTbRGO7x3Tk3dx61D1nSRqGCZUn2U3OPCl4rXmtlppOP70AQMQMkbSV_Fk5crxYOHzSCtVRMGlIcFySUu6ynz8bn4J_QW5rGrbERxOk-IHstfSTz6HzIlOR3LNUroMv-JUy_ggre7vs1s13iDBK-XVF6J5oYFE33O17ss7vVkg5GkUD70XXGMQMlXVJghW9aFgX4rL00t73ofLvx1QZr7v5mbLMDcqkeGzysws8-y6YYurZBWlx3HO4R5YfLRSEpz_uZYzrEfLIZPRiMh35uLnJJPrEv2IeX6NIhvGOpfqMEKhEC26z96jv5tqfencyGCOp6KKR_umpAQEwwWB05kJB6-gyuYgtnMZQA0IQK8WoosYAbxv0Cjl1nDU7yoEJJUdris9JAecisQSvQtuzOzCEjSjS4OyokxCUERnA==; alicnweb=touch_tb_at%3D1624586276427%7Clastlogonid%3Dtangyuanyuan19821027%7Cshow_inter_tips%3Dfalse; tfstk=cDkcBNOEfjPfPdFoOKwjmAPLQoxGZf6a-AkSUAGcHXrqpYDPi3CPTWtHqrDFq11..; l=eBEhCEZljj0CxwxUBOfwourza77OSIRAguPzaNbMiOCPOASM5YTcW69WxopHC3GVhsMJR37vCcaaBeYBqIArQ2ECAKVnP4Mmn; isg=BIeHzGqwq8uffS-VmwNoiNO4FjtRjFtueAnZu1l0o5Y9yKeKYVzrvsWOaoiWIDPm'
            }
        })
        .then(res => {    

            // console.log(res);
            // 抓取页面内容
            // res.on("data", chunk => {
            //     html += chunk;
            // });
            var $ = cheerio.load(res.data); 
            // console.log($('#dt-tab li'))

            // 标题
            // console.log($('#mod-detail-title .d-title').text())

            // 图片
            for(var i=0,len=$('#dt-tab li').length;i<len;i++){

                let src = $($('#dt-tab li')[i]).find('img').attr('src');


                (async (src) => {
                    try {
                        let url = src.replaceAll(/.60X60/ig, '');
                        console.log(url)
                        let opts = {
                            url: url,
                        };
                        let path = url.match(/\/([^/]*)$/)[1];
                        let r1 = await fileDownload.downImg(opts, path);
                    } catch (e) {
                    }
                })(src)

                // console.log($('#dt-tab li').find('img').attr('src').replace('.60X60', ''));

            }

            // 属性
            // $('#mod-detail-attributes').attr('data-mod-config');

            // 详情
            // $('#desc-lazyload-container').html();

            // console.log($('#de-description-detail').html())

        })
        .catch(error => {        
            console.log(error);
        });

    // https.get(targetUrl, res => {

    //         var html = ""; // 保存抓取到的 HTML 源码

    //         res.setEncoding("utf-8");

    //         // 抓取页面内容
    //         res.on("data", chunk => {
    //             html += chunk;
    //         });

    //         res.on("end", () => {

    //             let $ = cheerio.load(html),
    //                 priceData = {
    //                     creatDate: new Date().getTime()
    //                 },
    //                 copper = {},
    //                 aluminum = {};
    //             console.log(html)
    //             // for (
    //             //     let i = 0, len = $(".cnal-market-table td").length;
    //             //     i < len;
    //             //     i++
    //             // ) {
    //             //     let type = $($(".cnal-market-table td")[i]).text(),
    //             //         $parent = $($(".cnal-market-table td")[i]).parent();

    //             //     if (type === "铝") {
    //             //         aluminum.price = ($($parent.find("td")[2]).text() * 1) / 1000;
    //             //         aluminum.type = 0;
    //             //     } else if (type === "铜") {
    //             //         copper.price = ($($parent.find("td")[2]).text() * 1) / 1000;
    //             //         copper.type = 1;
    //             //     }

    //             //     priceData.upDateTime = $($parent.find("td")[4]).text();
    //             // }

    //         });
    //     })
    //     .on("error", function (err) {
    //         console.log(err);
    //     });
})();
