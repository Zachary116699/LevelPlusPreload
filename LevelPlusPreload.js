// ==UserScript==
// @name         LevelPlusPreload
// @namespace    http://tampermonkey.net/
// @version      2024-05-22
// @description  try to take over the world!
// @author       ZacharyZzz
// @match        https://www.level-plus.net/*
// @match        https://www.north-plus.net/*
// @icon         blob:chrome-extension://iikmkjmpaadaobahmlepeloendndfphd/daa70cd2-b521-4305-bcde-97df1824f003
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    // 获取帖子一楼的图片列表（第一张图片是头像）
    async function getImgUrls(href){
        let doc = await fetchPostAsDom(href);
        let first_post = doc.querySelector('div.t5.t2');
        if (first_post == null) {
            return [];
        }
        let img_doms = first_post.querySelectorAll('div#read_tpc a > img');

        let img_urls = [];
        for (let i = 0; i < img_doms.length; i++) {
            img_urls.push(img_doms[i].src);
        }

        img_doms = first_post.querySelectorAll('div#read_tpc img');

        for (let i = 0; i < img_doms.length; i++) {
            img_urls.push(img_doms[i].src);
        }

        // 过滤表情
        let pure_img_urls = [];
        for (let i = 0; i < img_doms.length; i++) {
            let res = img_urls[i].includes("face");
            if (!res) {
                pure_img_urls.push(img_urls[i]);
            }
        }
        return pure_img_urls;
    }

    // 获取对应链接的dom对象
    async function fetchPostAsDom(href){
        let post = await fetch(href);
        let text = await post.text();

        let parser = new DOMParser();
        let doc = parser.parseFromString(text, 'text/html');
        return doc;
    }

    // 获取所有帖子
    var post_list = document.querySelectorAll('tr.tr3');
    for (let i = 0; i < post_list.length; i++) {
        let tr = post_list[i];
        let th_a = tr.querySelector(' a');
        let href = th_a.href;
        let img_urls = await getImgUrls(href);

        // 创建div放图片
        let div = document.createElement("div");
        div.style.cssText = "position: absolute; border: 1px solid #4169E1; overflow: hidden;";

        // 创建a放图片
        let a = document.createElement("a");

        // 创建图片
        let img = document.createElement("img");
        img.style.cssText = "max-width: 300px;";
        img.src = "https://img.chkaja.com/3ad1df0dfddccd8d.png";
        if (img_urls.length > 0) {
            img.src = img_urls[0];
        }

        a.appendChild(img);
        div.appendChild(a);
        tr.appendChild(div);
        //tr.insertBefore(div, tr.childNodes[0]);
        div.style.display = "none";

        // 创建隐藏图片的事件
        tr.onmouseover = () => {
            tr.style.background = "#E1FFFF";
            let th = tr.childNodes[1];
            if (th != null) {
                //th.style.display = "none";
            }

            div.style.display = "";
        }
        tr.onmouseout = () => {
            tr.style.background = "#ffffff";
            let th = tr.childNodes[1];
            if (th != null) {
                //th.style.display = "";
            }

            div.style.display = "none";
        }
        let a_idx = 0;
        a.onclick = () => {
            a_idx += 1;
            if (a_idx > img_urls.length) {
                a_idx = 0;
            }
            if (img_urls.length > 0) {
                img.src = img_urls[a_idx];
            }
        }
    }
})();