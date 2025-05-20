import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Input, Card, Typography, Space, Descriptions, Alert, Button, message, AutoComplete, Modal } from 'antd';
import { CopyOutlined, CameraOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './ui.css';
import Tesseract from 'tesseract.js';

const { Title } = Typography;

// 小型郵遞區號測試資料（可擴充）
const zipcodeDB = [
  // 台北市
  { city: '台北市', district: '中正區', zipcode: '100' },
  { city: '台北市', district: '大同區', zipcode: '103' },
  { city: '台北市', district: '中山區', zipcode: '104' },
  { city: '台北市', district: '松山區', zipcode: '105' },
  { city: '台北市', district: '大安區', zipcode: '106' },
  { city: '台北市', district: '萬華區', zipcode: '108' },
  { city: '台北市', district: '信義區', zipcode: '110' },
  { city: '台北市', district: '士林區', zipcode: '111' },
  { city: '台北市', district: '北投區', zipcode: '112' },
  { city: '台北市', district: '內湖區', zipcode: '114' },
  { city: '台北市', district: '南港區', zipcode: '115' },
  { city: '台北市', district: '文山區', zipcode: '116' },
  
  // 新北市
  { city: '新北市', district: '板橋區', zipcode: '220' },
  { city: '新北市', district: '三重區', zipcode: '241' },
  { city: '新北市', district: '中和區', zipcode: '235' },
  { city: '新北市', district: '永和區', zipcode: '234' },
  { city: '新北市', district: '新莊區', zipcode: '242' },
  { city: '新北市', district: '新店區', zipcode: '231' },
  { city: '新北市', district: '土城區', zipcode: '236' },
  { city: '新北市', district: '蘆洲區', zipcode: '247' },
  { city: '新北市', district: '汐止區', zipcode: '221' },
  { city: '新北市', district: '樹林區', zipcode: '238' },
  { city: '新北市', district: '淡水區', zipcode: '251' },
  { city: '新北市', district: '三峽區', zipcode: '237' },
  { city: '新北市', district: '林口區', zipcode: '244' },
  { city: '新北市', district: '五股區', zipcode: '248' },
  { city: '新北市', district: '泰山區', zipcode: '243' },
  { city: '新北市', district: '鶯歌區', zipcode: '239' },
  { city: '新北市', district: '八里區', zipcode: '249' },
  { city: '新北市', district: '瑞芳區', zipcode: '224' },
  { city: '新北市', district: '金山區', zipcode: '208' },
  { city: '新北市', district: '萬里區', zipcode: '207' },
  { city: '新北市', district: '石門區', zipcode: '253' },
  { city: '新北市', district: '三芝區', zipcode: '252' },
  { city: '新北市', district: '石碇區', zipcode: '223' },
  { city: '新北市', district: '坪林區', zipcode: '232' },
  { city: '新北市', district: '烏來區', zipcode: '233' },
  { city: '新北市', district: '平溪區', zipcode: '226' },
  { city: '新北市', district: '雙溪區', zipcode: '227' },
  { city: '新北市', district: '貢寮區', zipcode: '228' },
  { city: '新北市', district: '深坑區', zipcode: '222' },
  
  // 桃園市
  { city: '桃園市', district: '桃園區', zipcode: '330' },
  { city: '桃園市', district: '中壢區', zipcode: '320' },
  { city: '桃園市', district: '平鎮區', zipcode: '324' },
  { city: '桃園市', district: '八德區', zipcode: '334' },
  { city: '桃園市', district: '楊梅區', zipcode: '326' },
  { city: '桃園市', district: '蘆竹區', zipcode: '338' },
  { city: '桃園市', district: '大溪區', zipcode: '335' },
  { city: '桃園市', district: '龜山區', zipcode: '333' },
  { city: '桃園市', district: '大園區', zipcode: '337' },
  { city: '桃園市', district: '觀音區', zipcode: '328' },
  { city: '桃園市', district: '新屋區', zipcode: '327' },
  { city: '桃園市', district: '復興區', zipcode: '336' },
  { city: '桃園市', district: '龍潭區', zipcode: '325' },
  
  // 台中市
  { city: '台中市', district: '中區', zipcode: '400' },
  { city: '台中市', district: '東區', zipcode: '401' },
  { city: '台中市', district: '南區', zipcode: '402' },
  { city: '台中市', district: '西區', zipcode: '403' },
  { city: '台中市', district: '北區', zipcode: '404' },
  { city: '台中市', district: '北屯區', zipcode: '406' },
  { city: '台中市', district: '西屯區', zipcode: '407' },
  { city: '台中市', district: '南屯區', zipcode: '408' },
  { city: '台中市', district: '太平區', zipcode: '411' },
  { city: '台中市', district: '大里區', zipcode: '412' },
  { city: '台中市', district: '霧峰區', zipcode: '413' },
  { city: '台中市', district: '烏日區', zipcode: '414' },
  { city: '台中市', district: '豐原區', zipcode: '420' },
  { city: '台中市', district: '后里區', zipcode: '421' },
  { city: '台中市', district: '石岡區', zipcode: '422' },
  { city: '台中市', district: '東勢區', zipcode: '423' },
  { city: '台中市', district: '和平區', zipcode: '424' },
  { city: '台中市', district: '新社區', zipcode: '426' },
  { city: '台中市', district: '潭子區', zipcode: '427' },
  { city: '台中市', district: '大雅區', zipcode: '428' },
  { city: '台中市', district: '神岡區', zipcode: '429' },
  { city: '台中市', district: '大肚區', zipcode: '432' },
  { city: '台中市', district: '沙鹿區', zipcode: '433' },
  { city: '台中市', district: '龍井區', zipcode: '434' },
  { city: '台中市', district: '梧棲區', zipcode: '435' },
  { city: '台中市', district: '清水區', zipcode: '436' },
  { city: '台中市', district: '大甲區', zipcode: '437' },
  { city: '台中市', district: '外埔區', zipcode: '438' },
  { city: '台中市', district: '大安區', zipcode: '439' },
  
  // 台南市
  { city: '台南市', district: '中西區', zipcode: '700' },
  { city: '台南市', district: '東區', zipcode: '701' },
  { city: '台南市', district: '南區', zipcode: '702' },
  { city: '台南市', district: '北區', zipcode: '704' },
  { city: '台南市', district: '安平區', zipcode: '708' },
  { city: '台南市', district: '安南區', zipcode: '709' },
  { city: '台南市', district: '永康區', zipcode: '710' },
  { city: '台南市', district: '歸仁區', zipcode: '711' },
  { city: '台南市', district: '新化區', zipcode: '712' },
  { city: '台南市', district: '左鎮區', zipcode: '713' },
  { city: '台南市', district: '玉井區', zipcode: '714' },
  { city: '台南市', district: '楠西區', zipcode: '715' },
  { city: '台南市', district: '南化區', zipcode: '716' },
  { city: '台南市', district: '仁德區', zipcode: '717' },
  { city: '台南市', district: '關廟區', zipcode: '718' },
  { city: '台南市', district: '龍崎區', zipcode: '719' },
  { city: '台南市', district: '官田區', zipcode: '720' },
  { city: '台南市', district: '麻豆區', zipcode: '721' },
  { city: '台南市', district: '佳里區', zipcode: '722' },
  { city: '台南市', district: '西港區', zipcode: '723' },
  { city: '台南市', district: '七股區', zipcode: '724' },
  { city: '台南市', district: '將軍區', zipcode: '725' },
  { city: '台南市', district: '學甲區', zipcode: '726' },
  { city: '台南市', district: '北門區', zipcode: '727' },
  { city: '台南市', district: '新營區', zipcode: '730' },
  { city: '台南市', district: '後壁區', zipcode: '731' },
  { city: '台南市', district: '白河區', zipcode: '732' },
  { city: '台南市', district: '東山區', zipcode: '733' },
  { city: '台南市', district: '六甲區', zipcode: '734' },
  { city: '台南市', district: '下營區', zipcode: '735' },
  { city: '台南市', district: '柳營區', zipcode: '736' },
  { city: '台南市', district: '鹽水區', zipcode: '737' },
  { city: '台南市', district: '善化區', zipcode: '741' },
  { city: '台南市', district: '大內區', zipcode: '742' },
  { city: '台南市', district: '山上區', zipcode: '743' },
  { city: '台南市', district: '新市區', zipcode: '744' },
  { city: '台南市', district: '安定區', zipcode: '745' },
  
  // 高雄市
  { city: '高雄市', district: '新興區', zipcode: '800' },
  { city: '高雄市', district: '前金區', zipcode: '801' },
  { city: '高雄市', district: '苓雅區', zipcode: '802' },
  { city: '高雄市', district: '鹽埕區', zipcode: '803' },
  { city: '高雄市', district: '鼓山區', zipcode: '804' },
  { city: '高雄市', district: '旗津區', zipcode: '805' },
  { city: '高雄市', district: '前鎮區', zipcode: '806' },
  { city: '高雄市', district: '三民區', zipcode: '807' },
  { city: '高雄市', district: '楠梓區', zipcode: '811' },
  { city: '高雄市', district: '小港區', zipcode: '812' },
  { city: '高雄市', district: '左營區', zipcode: '813' },
  { city: '高雄市', district: '仁武區', zipcode: '814' },
  { city: '高雄市', district: '大社區', zipcode: '815' },
  { city: '高雄市', district: '岡山區', zipcode: '820' },
  { city: '高雄市', district: '路竹區', zipcode: '821' },
  { city: '高雄市', district: '阿蓮區', zipcode: '822' },
  { city: '高雄市', district: '田寮區', zipcode: '823' },
  { city: '高雄市', district: '燕巢區', zipcode: '824' },
  { city: '高雄市', district: '橋頭區', zipcode: '825' },
  { city: '高雄市', district: '梓官區', zipcode: '826' },
  { city: '高雄市', district: '彌陀區', zipcode: '827' },
  { city: '高雄市', district: '永安區', zipcode: '828' },
  { city: '高雄市', district: '湖內區', zipcode: '829' },
  { city: '高雄市', district: '鳳山區', zipcode: '830' },
  { city: '高雄市', district: '大寮區', zipcode: '831' },
  { city: '高雄市', district: '林園區', zipcode: '832' },
  { city: '高雄市', district: '鳥松區', zipcode: '833' },
  { city: '高雄市', district: '大樹區', zipcode: '840' },
  { city: '高雄市', district: '旗山區', zipcode: '842' },
  { city: '高雄市', district: '美濃區', zipcode: '843' },
  { city: '高雄市', district: '六龜區', zipcode: '844' },
  { city: '高雄市', district: '內門區', zipcode: '845' },
  { city: '高雄市', district: '杉林區', zipcode: '846' },
  { city: '高雄市', district: '甲仙區', zipcode: '847' },
  { city: '高雄市', district: '桃源區', zipcode: '848' },
  { city: '高雄市', district: '那瑪夏區', zipcode: '849' },
  { city: '高雄市', district: '茂林區', zipcode: '851' },
  { city: '高雄市', district: '茄萣區', zipcode: '852' },
  
  // 基隆市
  { city: '基隆市', district: '中正區', zipcode: '202' },
  { city: '基隆市', district: '七堵區', zipcode: '206' },
  { city: '基隆市', district: '暖暖區', zipcode: '205' },
  { city: '基隆市', district: '仁愛區', zipcode: '200' },
  { city: '基隆市', district: '中山區', zipcode: '203' },
  { city: '基隆市', district: '安樂區', zipcode: '204' },
  { city: '基隆市', district: '信義區', zipcode: '201' },
  
  // 新竹市
  { city: '新竹市', district: '東區', zipcode: '300' },
  { city: '新竹市', district: '北區', zipcode: '300' },
  { city: '新竹市', district: '香山區', zipcode: '300' },
  
  // 嘉義市
  { city: '嘉義市', district: '東區', zipcode: '600' },
  { city: '嘉義市', district: '西區', zipcode: '600' },
  
  // 新竹縣
  { city: '新竹縣', district: '竹北市', zipcode: '302' },
  { city: '新竹縣', district: '湖口鄉', zipcode: '303' },
  { city: '新竹縣', district: '新豐鄉', zipcode: '304' },
  { city: '新竹縣', district: '新埔鎮', zipcode: '305' },
  { city: '新竹縣', district: '關西鎮', zipcode: '306' },
  { city: '新竹縣', district: '芎林鄉', zipcode: '307' },
  { city: '新竹縣', district: '寶山鄉', zipcode: '308' },
  { city: '新竹縣', district: '竹東鎮', zipcode: '310' },
  { city: '新竹縣', district: '五峰鄉', zipcode: '311' },
  { city: '新竹縣', district: '橫山鄉', zipcode: '312' },
  { city: '新竹縣', district: '尖石鄉', zipcode: '313' },
  { city: '新竹縣', district: '北埔鄉', zipcode: '314' },
  { city: '新竹縣', district: '峨眉鄉', zipcode: '315' },
  
  // 苗栗縣
  { city: '苗栗縣', district: '竹南鎮', zipcode: '350' },
  { city: '苗栗縣', district: '頭份市', zipcode: '351' },
  { city: '苗栗縣', district: '三灣鄉', zipcode: '352' },
  { city: '苗栗縣', district: '南庄鄉', zipcode: '353' },
  { city: '苗栗縣', district: '獅潭鄉', zipcode: '354' },
  { city: '苗栗縣', district: '後龍鎮', zipcode: '356' },
  { city: '苗栗縣', district: '通霄鎮', zipcode: '357' },
  { city: '苗栗縣', district: '苑裡鎮', zipcode: '358' },
  { city: '苗栗縣', district: '苗栗市', zipcode: '360' },
  { city: '苗栗縣', district: '造橋鄉', zipcode: '361' },
  { city: '苗栗縣', district: '頭屋鄉', zipcode: '362' },
  { city: '苗栗縣', district: '公館鄉', zipcode: '363' },
  { city: '苗栗縣', district: '大湖鄉', zipcode: '364' },
  { city: '苗栗縣', district: '泰安鄉', zipcode: '365' },
  { city: '苗栗縣', district: '銅鑼鄉', zipcode: '366' },
  { city: '苗栗縣', district: '三義鄉', zipcode: '367' },
  { city: '苗栗縣', district: '西湖鄉', zipcode: '368' },
  { city: '苗栗縣', district: '卓蘭鎮', zipcode: '369' },
  
  // 彰化縣
  { city: '彰化縣', district: '彰化市', zipcode: '500' },
  { city: '彰化縣', district: '芬園鄉', zipcode: '502' },
  { city: '彰化縣', district: '花壇鄉', zipcode: '503' },
  { city: '彰化縣', district: '秀水鄉', zipcode: '504' },
  { city: '彰化縣', district: '鹿港鎮', zipcode: '505' },
  { city: '彰化縣', district: '福興鄉', zipcode: '506' },
  { city: '彰化縣', district: '線西鄉', zipcode: '507' },
  { city: '彰化縣', district: '和美鎮', zipcode: '508' },
  { city: '彰化縣', district: '伸港鄉', zipcode: '509' },
  { city: '彰化縣', district: '員林市', zipcode: '510' },
  { city: '彰化縣', district: '社頭鄉', zipcode: '511' },
  { city: '彰化縣', district: '永靖鄉', zipcode: '512' },
  { city: '彰化縣', district: '埔心鄉', zipcode: '513' },
  { city: '彰化縣', district: '溪湖鎮', zipcode: '514' },
  { city: '彰化縣', district: '大村鄉', zipcode: '515' },
  { city: '彰化縣', district: '埔鹽鄉', zipcode: '516' },
  { city: '彰化縣', district: '田中鎮', zipcode: '520' },
  { city: '彰化縣', district: '北斗鎮', zipcode: '521' },
  { city: '彰化縣', district: '田尾鄉', zipcode: '522' },
  { city: '彰化縣', district: '埤頭鄉', zipcode: '523' },
  { city: '彰化縣', district: '溪州鄉', zipcode: '524' },
  { city: '彰化縣', district: '竹塘鄉', zipcode: '525' },
  { city: '彰化縣', district: '二林鎮', zipcode: '526' },
  { city: '彰化縣', district: '大城鄉', zipcode: '527' },
  { city: '彰化縣', district: '芳苑鄉', zipcode: '528' },
  { city: '彰化縣', district: '二水鄉', zipcode: '530' },
  
  // 南投縣
  { city: '南投縣', district: '南投市', zipcode: '540' },
  { city: '南投縣', district: '中寮鄉', zipcode: '541' },
  { city: '南投縣', district: '草屯鎮', zipcode: '542' },
  { city: '南投縣', district: '國姓鄉', zipcode: '544' },
  { city: '南投縣', district: '埔里鎮', zipcode: '545' },
  { city: '南投縣', district: '仁愛鄉', zipcode: '546' },
  { city: '南投縣', district: '名間鄉', zipcode: '551' },
  { city: '南投縣', district: '集集鎮', zipcode: '552' },
  { city: '南投縣', district: '水里鄉', zipcode: '553' },
  { city: '南投縣', district: '魚池鄉', zipcode: '555' },
  { city: '南投縣', district: '信義鄉', zipcode: '556' },
  { city: '南投縣', district: '竹山鎮', zipcode: '557' },
  { city: '南投縣', district: '鹿谷鄉', zipcode: '558' },
  
  // 雲林縣
  { city: '雲林縣', district: '斗南鎮', zipcode: '630' },
  { city: '雲林縣', district: '大埤鄉', zipcode: '631' },
  { city: '雲林縣', district: '虎尾鎮', zipcode: '632' },
  { city: '雲林縣', district: '土庫鎮', zipcode: '633' },
  { city: '雲林縣', district: '褒忠鄉', zipcode: '634' },
  { city: '雲林縣', district: '東勢鄉', zipcode: '635' },
  { city: '雲林縣', district: '台西鄉', zipcode: '636' },
  { city: '雲林縣', district: '崙背鄉', zipcode: '637' },
  { city: '雲林縣', district: '麥寮鄉', zipcode: '638' },
  { city: '雲林縣', district: '斗六市', zipcode: '640' },
  { city: '雲林縣', district: '林內鄉', zipcode: '643' },
  { city: '雲林縣', district: '古坑鄉', zipcode: '646' },
  { city: '雲林縣', district: '莿桐鄉', zipcode: '647' },
  { city: '雲林縣', district: '西螺鎮', zipcode: '648' },
  { city: '雲林縣', district: '二崙鄉', zipcode: '649' },
  { city: '雲林縣', district: '北港鎮', zipcode: '651' },
  { city: '雲林縣', district: '水林鄉', zipcode: '652' },
  { city: '雲林縣', district: '口湖鄉', zipcode: '653' },
  { city: '雲林縣', district: '四湖鄉', zipcode: '654' },
  { city: '雲林縣', district: '元長鄉', zipcode: '655' },
  
  // 嘉義縣
  { city: '嘉義縣', district: '番路鄉', zipcode: '602' },
  { city: '嘉義縣', district: '梅山鄉', zipcode: '603' },
  { city: '嘉義縣', district: '竹崎鄉', zipcode: '604' },
  { city: '嘉義縣', district: '阿里山鄉', zipcode: '605' },
  { city: '嘉義縣', district: '中埔鄉', zipcode: '606' },
  { city: '嘉義縣', district: '大埔鄉', zipcode: '607' },
  { city: '嘉義縣', district: '水上鄉', zipcode: '608' },
  { city: '嘉義縣', district: '鹿草鄉', zipcode: '611' },
  { city: '嘉義縣', district: '太保市', zipcode: '612' },
  { city: '嘉義縣', district: '朴子市', zipcode: '613' },
  { city: '嘉義縣', district: '東石鄉', zipcode: '614' },
  { city: '嘉義縣', district: '六腳鄉', zipcode: '615' },
  { city: '嘉義縣', district: '新港鄉', zipcode: '616' },
  { city: '嘉義縣', district: '民雄鄉', zipcode: '621' },
  { city: '嘉義縣', district: '大林鎮', zipcode: '622' },
  { city: '嘉義縣', district: '溪口鄉', zipcode: '623' },
  { city: '嘉義縣', district: '義竹鄉', zipcode: '624' },
  { city: '嘉義縣', district: '布袋鎮', zipcode: '625' },
  
  // 屏東縣
  { city: '屏東縣', district: '屏東市', zipcode: '900' },
  { city: '屏東縣', district: '三地門鄉', zipcode: '901' },
  { city: '屏東縣', district: '霧台鄉', zipcode: '902' },
  { city: '屏東縣', district: '瑪家鄉', zipcode: '903' },
  { city: '屏東縣', district: '九如鄉', zipcode: '904' },
  { city: '屏東縣', district: '里港鄉', zipcode: '905' },
  { city: '屏東縣', district: '高樹鄉', zipcode: '906' },
  { city: '屏東縣', district: '鹽埔鄉', zipcode: '907' },
  { city: '屏東縣', district: '長治鄉', zipcode: '908' },
  { city: '屏東縣', district: '麟洛鄉', zipcode: '909' },
  { city: '屏東縣', district: '竹田鄉', zipcode: '911' },
  { city: '屏東縣', district: '內埔鄉', zipcode: '912' },
  { city: '屏東縣', district: '萬丹鄉', zipcode: '913' },
  { city: '屏東縣', district: '潮州鎮', zipcode: '920' },
  { city: '屏東縣', district: '泰武鄉', zipcode: '921' },
  { city: '屏東縣', district: '來義鄉', zipcode: '922' },
  { city: '屏東縣', district: '萬巒鄉', zipcode: '923' },
  { city: '屏東縣', district: '崁頂鄉', zipcode: '924' },
  { city: '屏東縣', district: '新埤鄉', zipcode: '925' },
  { city: '屏東縣', district: '南州鄉', zipcode: '926' },
  { city: '屏東縣', district: '林邊鄉', zipcode: '927' },
  { city: '屏東縣', district: '東港鎮', zipcode: '928' },
  { city: '屏東縣', district: '琉球鄉', zipcode: '929' },
  { city: '屏東縣', district: '佳冬鄉', zipcode: '931' },
  { city: '屏東縣', district: '新園鄉', zipcode: '932' },
  { city: '屏東縣', district: '枋寮鄉', zipcode: '940' },
  { city: '屏東縣', district: '枋山鄉', zipcode: '941' },
  { city: '屏東縣', district: '春日鄉', zipcode: '942' },
  { city: '屏東縣', district: '獅子鄉', zipcode: '943' },
  { city: '屏東縣', district: '車城鄉', zipcode: '944' },
  { city: '屏東縣', district: '牡丹鄉', zipcode: '945' },
  { city: '屏東縣', district: '恆春鎮', zipcode: '946' },
  { city: '屏東縣', district: '滿州鄉', zipcode: '947' },
  
  // 宜蘭縣
  { city: '宜蘭縣', district: '宜蘭市', zipcode: '260' },
  { city: '宜蘭縣', district: '頭城鎮', zipcode: '261' },
  { city: '宜蘭縣', district: '礁溪鄉', zipcode: '262' },
  { city: '宜蘭縣', district: '壯圍鄉', zipcode: '263' },
  { city: '宜蘭縣', district: '員山鄉', zipcode: '264' },
  { city: '宜蘭縣', district: '羅東鎮', zipcode: '265' },
  { city: '宜蘭縣', district: '三星鄉', zipcode: '266' },
  { city: '宜蘭縣', district: '大同鄉', zipcode: '267' },
  { city: '宜蘭縣', district: '五結鄉', zipcode: '268' },
  { city: '宜蘭縣', district: '冬山鄉', zipcode: '269' },
  { city: '宜蘭縣', district: '蘇澳鎮', zipcode: '270' },
  { city: '宜蘭縣', district: '南澳鄉', zipcode: '272' },
  
  // 花蓮縣
  { city: '花蓮縣', district: '花蓮市', zipcode: '970' },
  { city: '花蓮縣', district: '新城鄉', zipcode: '971' },
  { city: '花蓮縣', district: '秀林鄉', zipcode: '972' },
  { city: '花蓮縣', district: '吉安鄉', zipcode: '973' },
  { city: '花蓮縣', district: '壽豐鄉', zipcode: '974' },
  { city: '花蓮縣', district: '鳳林鎮', zipcode: '975' },
  { city: '花蓮縣', district: '光復鄉', zipcode: '976' },
  { city: '花蓮縣', district: '豐濱鄉', zipcode: '977' },
  { city: '花蓮縣', district: '瑞穗鄉', zipcode: '978' },
  { city: '花蓮縣', district: '萬榮鄉', zipcode: '979' },
  { city: '花蓮縣', district: '玉里鎮', zipcode: '981' },
  { city: '花蓮縣', district: '卓溪鄉', zipcode: '982' },
  { city: '花蓮縣', district: '富里鄉', zipcode: '983' },
  
  // 台東縣
  { city: '台東縣', district: '台東市', zipcode: '950' },
  { city: '台東縣', district: '綠島鄉', zipcode: '951' },
  { city: '台東縣', district: '蘭嶼鄉', zipcode: '952' },
  { city: '台東縣', district: '延平鄉', zipcode: '953' },
  { city: '台東縣', district: '卑南鄉', zipcode: '954' },
  { city: '台東縣', district: '鹿野鄉', zipcode: '955' },
  { city: '台東縣', district: '關山鎮', zipcode: '956' },
  { city: '台東縣', district: '海端鄉', zipcode: '957' },
  { city: '台東縣', district: '池上鄉', zipcode: '958' },
  { city: '台東縣', district: '東河鄉', zipcode: '959' },
  { city: '台東縣', district: '成功鎮', zipcode: '961' },
  { city: '台東縣', district: '長濱鄉', zipcode: '962' },
  { city: '台東縣', district: '太麻里鄉', zipcode: '963' },
  { city: '台東縣', district: '金峰鄉', zipcode: '964' },
  { city: '台東縣', district: '大武鄉', zipcode: '965' },
  { city: '台東縣', district: '達仁鄉', zipcode: '966' },
  
  // 澎湖縣
  { city: '澎湖縣', district: '馬公市', zipcode: '880' },
  { city: '澎湖縣', district: '西嶼鄉', zipcode: '881' },
  { city: '澎湖縣', district: '望安鄉', zipcode: '882' },
  { city: '澎湖縣', district: '七美鄉', zipcode: '883' },
  { city: '澎湖縣', district: '白沙鄉', zipcode: '884' },
  { city: '澎湖縣', district: '湖西鄉', zipcode: '885' },
  
  // 金門縣
  { city: '金門縣', district: '金沙鎮', zipcode: '890' },
  { city: '金門縣', district: '金湖鎮', zipcode: '891' },
  { city: '金門縣', district: '金寧鄉', zipcode: '892' },
  { city: '金門縣', district: '金城鎮', zipcode: '893' },
  { city: '金門縣', district: '烈嶼鄉', zipcode: '894' },
  { city: '金門縣', district: '烏坵鄉', zipcode: '896' },
  
  // 連江縣
  { city: '連江縣', district: '南竿鄉', zipcode: '209' },
  { city: '連江縣', district: '北竿鄉', zipcode: '210' },
  { city: '連江縣', district: '莒光鄉', zipcode: '211' },
  { city: '連江縣', district: '東引鄉', zipcode: '212' }
];

const cities = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '嘉義市',
  '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣',
  '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣'
];
const districts = [
  // 台北市
  '中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區',
  // 新北市
  '板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '土城區', '蘆洲區', '汐止區', '樹林區', '淡水區', '三峽區',
  '林口區', '五股區', '泰山區', '鶯歌區', '八里區', '瑞芳區', '金山區', '萬里區', '石門區', '三芝區', '石碇區', '坪林區',
  '烏來區', '平溪區', '雙溪區', '貢寮區', '深坑區',
  // 桃園市
  '桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龜山區', '大園區', '觀音區', '新屋區', '復興區', '龍潭區',
  // 台中市
  '中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區',
  '后里區', '石岡區', '東勢區', '和平區', '新社區', '潭子區', '大雅區', '神岡區', '大肚區', '沙鹿區', '龍井區', '梧棲區',
  '清水區', '大甲區', '外埔區', '大安區',
  // 台南市
  '中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區',
  '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區',
  '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區',
  // 高雄市
  '新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '三民區', '楠梓區', '小港區', '左營區', '仁武區',
  '大社區', '岡山區', '路竹區', '阿蓮區', '田寮區', '燕巢區', '橋頭區', '梓官區', '彌陀區', '永安區', '湖內區', '鳳山區',
  '大寮區', '林園區', '鳥松區', '大樹區', '旗山區', '美濃區', '六龜區', '內門區', '杉林區', '甲仙區', '桃源區', '那瑪夏區',
  '茂林區', '茄萣區',
  // 基隆市
  '中正區', '七堵區', '暖暖區', '仁愛區', '中山區', '安樂區', '信義區',
  // 新竹市
  '東區', '北區', '香山區',
  // 嘉義市
  '東區', '西區',
  // 新竹縣
  '竹北市', '湖口鄉', '新豐鄉', '新埔鎮', '關西鎮', '芎林鄉', '寶山鄉', '竹東鎮', '五峰鄉', '橫山鄉', '尖石鄉', '北埔鄉', '峨眉鄉',
  // 苗栗縣
  '竹南鎮', '頭份市', '三灣鄉', '南庄鄉', '獅潭鄉', '後龍鎮', '通霄鎮', '苑裡鎮', '苗栗市', '造橋鄉', '頭屋鄉', '公館鄉',
  '大湖鄉', '泰安鄉', '銅鑼鄉', '三義鄉', '西湖鄉', '卓蘭鎮',
  // 彰化縣
  '彰化市', '芬園鄉', '花壇鄉', '秀水鄉', '鹿港鎮', '福興鄉', '線西鄉', '和美鎮', '伸港鄉', '員林市', '社頭鄉', '永靖鄉',
  '埔心鄉', '溪湖鎮', '大村鄉', '埔鹽鄉', '田中鎮', '北斗鎮', '田尾鄉', '埤頭鄉', '溪州鄉', '竹塘鄉', '二林鎮', '大城鄉',
  '芳苑鄉', '二水鄉',
  // 南投縣
  '南投市', '中寮鄉', '草屯鎮', '國姓鄉', '埔里鎮', '仁愛鄉', '名間鄉', '集集鎮', '水里鄉', '魚池鄉', '信義鄉', '竹山鎮', '鹿谷鄉',
  // 雲林縣
  '斗南鎮', '大埤鄉', '虎尾鎮', '土庫鎮', '褒忠鄉', '東勢鄉', '台西鄉', '崙背鄉', '麥寮鄉', '斗六市', '林內鄉', '古坑鄉',
  '莿桐鄉', '西螺鎮', '二崙鄉', '北港鎮', '水林鄉', '口湖鄉', '四湖鄉', '元長鄉',
  // 嘉義縣
  '番路鄉', '梅山鄉', '竹崎鄉', '阿里山鄉', '中埔鄉', '大埔鄉', '水上鄉', '鹿草鄉', '太保市', '朴子市', '東石鄉', '六腳鄉',
  '新港鄉', '民雄鄉', '大林鎮', '溪口鄉', '義竹鄉', '布袋鎮',
  // 屏東縣
  '屏東市', '三地門鄉', '霧台鄉', '瑪家鄉', '九如鄉', '里港鄉', '高樹鄉', '鹽埔鄉', '長治鄉', '麟洛鄉', '竹田鄉', '內埔鄉',
  '萬丹鄉', '潮州鎮', '泰武鄉', '來義鄉', '萬巒鄉', '崁頂鄉', '新埤鄉', '南州鄉', '林邊鄉', '東港鎮', '琉球鄉', '佳冬鄉',
  '新園鄉', '枋寮鄉', '枋山鄉', '春日鄉', '獅子鄉', '車城鄉', '牡丹鄉', '恆春鎮', '滿州鄉',
  // 宜蘭縣
  '宜蘭市', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '羅東鎮', '三星鄉', '大同鄉', '五結鄉', '冬山鄉', '蘇澳鎮', '南澳鄉',
  // 花蓮縣
  '花蓮市', '新城鄉', '秀林鄉', '吉安鄉', '壽豐鄉', '鳳林鎮', '光復鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '玉里鎮', '卓溪鄉', '富里鄉',
  // 台東縣
  '台東市', '綠島鄉', '蘭嶼鄉', '延平鄉', '卑南鄉', '鹿野鄉', '關山鎮', '海端鄉', '池上鄉', '東河鄉', '成功鎮', '長濱鄉',
  '太麻里鄉', '金峰鄉', '大武鄉', '達仁鄉',
  // 澎湖縣
  '馬公市', '西嶼鄉', '望安鄉', '七美鄉', '白沙鄉', '湖西鄉',
  // 金門縣
  '金沙鎮', '金湖鎮', '金寧鄉', '金城鎮', '烈嶼鄉', '烏坵鄉',
  // 連江縣
  '南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'
];

// 標準順序解析
function parseTaiwanAddress(address) {
  const regex = /^(?<city>[^縣市]+[縣市])(?<district>[^鄉鎮市區]+[鄉鎮市區])?(?<road>.+)?$/;
  const match = address.match(regex);
  if (!match || !match.groups) return null;
  return {
    city: match.groups.city || '',
    district: match.groups.district || '',
    road: match.groups.road || '',
  };
}

// 強化模糊解析：不管順序，找出縣市、區名
function fuzzyParseAddress(address) {
  let foundCity = '';
  let foundDistrict = '';
  // 找縣市
  for (const city of cities) {
    if (address.includes(city)) {
      foundCity = city;
      break;
    }
  }
  // 找區名
  for (const district of districts) {
    if (address.includes(district)) {
      foundDistrict = district;
      break;
    }
  }
  // 組合建議
  if (foundCity && foundDistrict) {
    // 取得剩下的路名
    let road = address.replace(foundCity, '').replace(foundDistrict, '');
    return {
      city: foundCity,
      district: foundDistrict,
      road: road.trim(),
    };
  }
  return null;
}

// 查詢郵遞區號
function getZipcode(city, district) {
  const found = zipcodeDB.find(z => z.city === city && z.district === district);
  return found ? found.zipcode : '';
}

function App() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimer = useRef(null);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const fileInputRef = useRef();

  // 產生自動完成建議並即時查詢
  const handleInputChange = (value) => {
    setAddress(value);
    if (!value) {
      setSuggestions([]);
      setResult(null);
      setError(null);
      setCandidates([]);
      return;
    }
    // 找所有包含輸入字串的縣市、區、縣市+區
    const keyword = value.trim();
    const matched = zipcodeDB.filter(z =>
      z.city.includes(keyword) ||
      z.district.includes(keyword) ||
      (z.city + z.district).includes(keyword)
    );
    // 只顯示唯一組合
    const unique = Array.from(new Set(matched.map(z => z.city + z.district)))
      .map(str => {
        const z = matched.find(item => item.city + item.district === str);
        return { value: z.city + z.district, label: z.city + z.district };
      });
    setSuggestions(unique);
    // debounce 自動查詢
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      doSearch(value);
    }, 300);
  };

  // 選擇建議時自動查詢
  const handleSelectSuggestion = (value) => {
    setAddress(value);
    setSuggestions([]);
    doSearch(value);
  };

  // 查詢邏輯（可重複呼叫）
  const doSearch = (inputValue) => {
    setLoading(true);
    setError(null);
    setCandidates([]);
    setResult(null);
    const value = inputValue.trim();
    if (!value) {
      setLoading(false);
      return;
    }
    // 標準解析
    const parsedAddress = parseTaiwanAddress(value);
    let zipcode = '';
    if (parsedAddress && parsedAddress.city && parsedAddress.district) {
      zipcode = getZipcode(parsedAddress.city, parsedAddress.district);
      if (zipcode) {
        setResult({ ...parsedAddress, zipcode });
        setAddress(parsedAddress.city + parsedAddress.district);
        setLoading(false);
        return;
      }
    }
    // 模糊搜尋
    const matched = zipcodeDB.filter(z => value.includes(z.district) || value.includes(z.city));
    if (matched.length === 1) {
      setResult({ city: matched[0].city, district: matched[0].district, road: '', zipcode: matched[0].zipcode });
      setAddress(matched[0].city + matched[0].district);
      setLoading(false);
      return;
    } else if (matched.length > 1) {
      setCandidates(matched);
      setResult(null);
      setLoading(false);
      return;
    }
    setError('找不到對應的郵遞區號');
    setLoading(false);
  };

  // 點選候選時自動補全並查詢
  const handleSelectCandidate = (item) => {
    setResult({ city: item.city, district: item.district, road: '', zipcode: item.zipcode });
    setCandidates([]);
    setError(null);
    setAddress(item.city + item.district);
  };

  // 複製功能
  const handleCopyZip = () => {
    if (result?.zipcode) {
      navigator.clipboard.writeText(result.zipcode)
        .then(() => { message.success('郵遞區號已複製到剪貼簿'); })
        .catch(() => { message.error('複製失敗，請手動複製'); });
    }
  };
  const handleCopyAddress = () => {
    if (result) {
      const addr = `${result.city}${result.district}${result.road || ''}`;
      navigator.clipboard.writeText(addr)
        .then(() => { message.success('地址已複製到剪貼簿'); })
        .catch(() => { message.error('複製失敗，請手動複製'); });
    }
  };
  const handleCopyAll = () => {
    if (result) {
      const all = `${result.city}${result.district}${result.road || ''}${result.zipcode}`;
      navigator.clipboard.writeText(all)
        .then(() => { message.success('地址+郵遞區號已複製到剪貼簿'); })
        .catch(() => { message.error('複製失敗，請手動複製'); });
    }
  };

  // 拍照按鈕觸發
  const handleCameraClick = () => {
    setPrivacyVisible(true);
  };

  // 同意隱私後開啟檔案選擇（相機）
  const handlePrivacyOk = () => {
    setPrivacyVisible(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // OCR 辨識 for input file
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrLoading(true);
    setError(null);
    setSuggestions([]);
    setCandidates([]);
    setResult(null);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng+chi_tra');
      setAddress(text.replace(/\s/g, ''));
      message.success('辨識完成，請確認內容！');
    } catch (e) {
      setError('辨識失敗，請重試');
    }
    setOcrLoading(false);
  };

  return (
    <div className="app-container">
      <h1>中華郵政郵遞區號查詢助手</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <AutoComplete
          style={{ flex: 1 }}
          options={suggestions}
          value={address}
          onChange={handleInputChange}
          onSelect={handleSelectSuggestion}
          placeholder="請輸入完整地址或區名"
          filterOption={false}
        >
          <Input.Search
            enterButton="查詢"
            loading={loading || ocrLoading}
            size="large"
            onSearch={() => doSearch(address)}
          />
        </AutoComplete>
        <Button icon={<CameraOutlined />} size="large" onClick={handleCameraClick} loading={ocrLoading}>
          拍照輸入
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          capture="environment"
          onChange={handleFileChange}
        />
      </div>
      <Modal
        title="隱私權同意"
        open={privacyVisible}
        onOk={handlePrivacyOk}
        onCancel={() => setPrivacyVisible(false)}
        okText="同意並啟用相機"
        cancelText="取消"
      >
        <p>本功能僅用於即時辨識地址，圖片不會上傳或儲存。請確認您同意使用相機進行辨識。</p>
      </Modal>
      {error && (
        <Alert
          message="錯誤"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
      {candidates.length > 1 && (
        <Card style={{ marginTop: 16 }}>
          <p>有多個結果符合，請選擇：</p>
          {candidates.map((item, idx) => (
            <Button key={idx} style={{ margin: 4 }} onClick={() => handleSelectCandidate(item)}>
              {item.city} {item.district}（{item.zipcode}）
            </Button>
          ))}
        </Card>
      )}
      {result && (
        <Card style={{ marginTop: 16 }}>
          <p><strong>縣市：</strong>{result.city}</p>
          <p><strong>區鄉鎮：</strong>{result.district}</p>
          <p><strong>路名：</strong>{result.road}</p>
          <p><strong>郵遞區號：</strong>{result.zipcode}</p>
          <Space>
            <Button type="primary" onClick={handleCopyZip}>複製郵遞區號</Button>
            <Button onClick={handleCopyAddress}>複製地址</Button>
            <Button onClick={handleCopyAll}>複製地址+郵遞區號</Button>
          </Space>
        </Card>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
