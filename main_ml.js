
startTimer()
Enable_marking = true

const gamemode = localStorage.getItem('mode')
let abstime
var rounds = 1
var roundhtml = document.getElementById('round')
var timer = document.getElementById("timer")
const pretime = localStorage.getItem('time')
const prerounds = localStorage.getItem('rounds')
var prround = JSON.parse(prerounds) 
roundhtml.innerHTML = `1/${prround}`
time = JSON.parse(pretime) + 1
abstime =  JSON.parse(pretime) + 1



var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var violetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


var yellowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


var blackIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var color_list = {
    "#CC2A3D": redIcon,  
    "#9D2ECC": violetIcon,
    "#CBC52B": yellowIcon,
    "#CB852B": orangeIcon,
    "#3E3E3E": blackIcon,
    "#2C83CB": blueIcon
}

document.getElementById("marker_warning").style.color = color_list[color]

var score, video_coords, Enable_marking, points, marker_coords, map, marker, score_id, vidmarker, polyline, src, lat, lng, active_video, playersmarkers, time, inter, pause, interval, player, active_playlist
var guessed = true
var pausado = false
var playing = true
const modal = document.getElementById('modal')

var video_list = [ 
    ["jstF9EYr4IM", -37.992883, -57.564338, 833,'AR', 'CarpoWalks','https://www.youtube.com/@CarpoWalks','Mar del Plata'], 
    ["EIc2vyDRT20", -36.535465, -56.688901,300,'AR', 'CarpoWalks','https://www.youtube.com/@CarpoWalks','Santa Teresita'], 
    ["2G3Mq_D1Po8", 48.858907, 2.293025,140,'FR', 'CarpoWalks','https://www.youtube.com/@CarpoWalks','Paris'], 
    ["jYVJccE8Wa4", 43.322257, 11.330865, 935 ,'ITA', 'CarpoWalks','https://www.youtube.com/@CarpoWalks','Siena'], 
    ["zWxdKYxfcRQ", 44.499609, 11.343899, 866,'ITA', 'CarpoWalks','https://www.youtube.com/@CarpoWalks','Bolonia'], 
    ["dbICS9q9hVo", -32.890557, -68.844857, 240,'AR', 'CarpoWalks','https://www.youtube.com/@CarpoWalks','Mendoza'], 
    ["gpaB5d4C6hA", 45.465305, 9.194007,260,'ITA', 'CarpoWalks','https://www.youtube.com/@CarpoWalks','Milan'], 
    ["7a2cqy9Qwwg", 45.646856, 13.771754, 66,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Trieste'], 
    ["7a2cqy9Qwwg", 45.646856, 13.771754, 780,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Trieste'], 
    ["7a2cqy9Qwwg", 45.646856, 13.771754, 1652,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Trieste'], 
    ["7a2cqy9Qwwg", 45.646856, 13.771754, 2202,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Trieste'], 
    ["BMDso0Rqx3M", 45.975012, 9.247205,50,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Bellagio'], 
    ["BMDso0Rqx3M", 45.975012, 9.247205,518,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Bellagio'], 
    ["BMDso0Rqx3M", 45.975012, 9.247205,1164,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Bellagio'], 
    ["9vx9qm2_ghI", 45.463732, 9.190500,97,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Florence'], 
    ["9vx9qm2_ghI", 45.463732, 9.190500,984,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Florence'], 
    ["4xJf5PfuMjg", 44.117593, 15.219858,55,'CRO', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Zadar'], 
    ["4xJf5PfuMjg", 44.117593, 15.219858,390,'CRO', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Zadar'], 
    ["4xJf5PfuMjg", 44.117593, 15.219858,1028,'CRO', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Zadar'], 
    ["4xJf5PfuMjg", 44.117593, 15.219858,1615,'CRO', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Zadar'], 
    ["GkhMz52zMG0", 46.004807, 8.948346,345,'SWZ', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Lugano'], 
    ["GkhMz52zMG0", 46.004807, 8.948346,670,'SWZ', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Lugano'], 
    ["GkhMz52zMG0", 46.004807, 8.948346,1246,'SWZ', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Lugano'], 
    ["GkhMz52zMG0", 46.004807, 8.948346,1693,'SWZ', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Lugano'], 
    ["cSWv6YJYBHM", 43.508254, 16.440185,103,'CRO', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Split'], 
    ["cSWv6YJYBHM", 43.508254, 16.440185,732,'CRO', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Split'], 
    ["cSWv6YJYBHM", 43.508254, 16.440185,1060,'CRO', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Split'], 
    ["cSWv6YJYBHM", 43.508254, 16.440185,1405,'CRO', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Split'], 
    ["RInBAatA11Q", 52.247803, 21.013650,70,'POL', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Warsaw'], 
    ["RInBAatA11Q", 52.247803, 21.013650,656,'POL', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Warsaw'], 
    ["RInBAatA11Q", 52.247803, 21.013650,1180,'POL', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Warsaw'], 
    ["RInBAatA11Q", 52.247803, 21.013650,1654,'POL', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Warsaw'], 
    ["ZL4LNXe_F2Y", 42.642014, 18.112509,98,'POL', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Dubrovnik'], 
    ["ZL4LNXe_F2Y", 42.642014, 18.112509,845,'POL', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Dubrovnik'], 
    ["ZL4LNXe_F2Y", 42.642014, 18.112509,1415,'POL', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Dubrovnik'], 
    ["KQ5TW0DCXb0", 45.659127, 10.047541,99,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Iseo'], 
    ["KQ5TW0DCXb0", 45.659127, 10.047541,551,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Iseo'], 
    ["KQ5TW0DCXb0", 45.659127, 10.047541,1002,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Iseo'], 
    ["KkKmGQpEr9s", 43.818297, 7.777631,100,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Sanremo'], 
    ["KkKmGQpEr9s", 43.818297, 7.777631,520,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Sanremo'], 
    ["KkKmGQpEr9s", 43.818297, 7.777631,960,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Sanremo'], 
    ["KkKmGQpEr9s", 43.818297, 7.777631,1280,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Sanremo'], 
    ["m4D8LqsvXu0", 44.303984, 9.207712,640,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Portofino'],
    ["EtxCpMzu1GY", 52.360660, 4.887635,100,'NTH', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Amsterdam'],
    ["EtxCpMzu1GY", 52.366964, 4.889127,907,'NTH', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Amsterdam'],
    ["EtxCpMzu1GY", 52.376607, 4.899634,2249,'NTH', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Amsterdam'],
    ["-0YA3p8zvRE", 40.8391213,14.2495606,235,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Napoles'],
    ["-0YA3p8zvRE", 40.8401192,14.2484348,590,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Napoles'],
    ["-0YA3p8zvRE", 40.8473569,14.2515967,1984,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Napoles'],
    ["-0YA3p8zvRE", 40.8513121,14.2577763,2531,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Napoles'],
    ["-0YA3p8zvRE", 40.8413436,14.2520886,3302,'ITA', 'AtmosWalks','https://www.youtube.com/@AtmosWalks','Napoles'],
    ["by-2aEbso28", 51.601629,-0.3169,94,'UK', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Edgware'],
    ["by-2aEbso28", 51.601629,-0.3169,94,'UK', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Edgware'],
    ["by-2aEbso28", 51.607338, -0.301417,1110,'UK', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Edgware'],
    ["by-2aEbso28", 51.6076714,-0.2905685,1743,'UK', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Edgware'],
    ["by-2aEbso28", 51.6102515,-0.2829999,1743,'UK', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Edgware'],
    ["_aQVlq9jOlw", 51.5949805,-0.3145607,410,'UK', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Harrow'],
    ["_aQVlq9jOlw", 51.600035, -0.312838,1728,'UK', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Harrow'],
    ["cQilmRKq9A0", 34.007217, -118.496112,693,'US', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Los Angeles'],
    ["cQilmRKq9A0", 34.007968, -118.494115,1165,'US', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Los Angeles'],
    ["xAN7PVS8Hko", 34.0691215,-118.2913733,119,'US', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Los Angeles'],
    ["xAN7PVS8Hko", 34.076186, -118.291566,932,'US', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Los Angeles'],
    ["xAN7PVS8Hko", 34.0729513,-118.2915304,1842,'US', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Los Angeles'],
    ["teHOCmM18ZU", 34.0769519,-118.3803203,127,'US', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Los Angeles'],
    ["teHOCmM18ZU", 34.077164, -118.376534,1227,'US', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Los Angeles'],
    ["25iy2ZFAMZE", 34.101665, -118.338577,24,'US', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Los Angeles'],
    ["BYX7lxGRl3Q", 33.8148071,-117.9215549,185,'US', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','Los Angeles'],
    ["bEt-vzKFVP8", 51.509009, -0.087134,445,'UK', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','London'],
    ["bEt-vzKFVP8", 51.5074602,-0.0776777,1428,'UK', 'Voyager Walks','https://www.youtube.com/@TheVoyagerWalks','London'],
    ["jrd8_6iFA8M", 41.0365019,28.9833963,171,'TR', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','Instabul'],
    ["jrd8_6iFA8M", 41.035325, 28.981794,486,'TR', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','Instabul'],
    ["jrd8_6iFA8M", 41.0316971,28.9760594,1055,'TR', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','Instabul'],
    ["wG0bqfgKJKU", 51.5107977,-0.0984437,600,'UK', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','London'],
    ["wG0bqfgKJKU", 51.513865, -0.101370,216,'UK', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','London'],
    ["wG0bqfgKJKU", 51.507418, -0.092923,1200,'UK', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','London'],
    ["wG0bqfgKJKU", 51.5100729,-0.0869013,1884,'UK', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','London'],
    ["wG0bqfgKJKU", 51.5130422,-0.090591,3173,'UK', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','London'],
    ["41Swm3AtU48", 50.847373, 4.351958,258,'BE', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','Brussels'],
    ["41Swm3AtU48", 50.8465143,4.3495567,750,'BE', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','Brussels'],
    ["41Swm3AtU48", 50.84529,4.3470555,1084,'BE', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','Brussels'],
    ["rFfWAwsdZWI", 59.913840, 10.738698,81,'NW', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','Oslo'],
    ["rFfWAwsdZWI", 59.9134949,10.7398892,1140,'NW', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','Oslo'],
    ["rFfWAwsdZWI", 59.9119644,10.7485938,1725,'NW', 'Atmos Walks','https://www.youtube.com/@AtmosWalks','Oslo'],
    ['sKTox7DglVg',37.8093724,-122.4759122,301, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','San Francisco'],
    ['sKTox7DglVg',37.8084333,-122.4729643,1400, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','San Francisco'],
    // ['a6VI-4YNHR0',40.7567671,-73.9865428,6, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew',''],
    ['4ugekTk2_Ss',40.6908017,-74.045311,315, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','New York'],
    ['-jHtx64DUuw',21.4310782,-157.8315108,5, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Yucatan'],
    ['0WFAbXjpC1s',21.281624, -157.830731,107, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Hawaii'],
    ['0WFAbXjpC1s',21.2740059,-157.824152,1273, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Hawaii'],
    ['0WFAbXjpC1s',21.277048, -157.826154,2089, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Hawaii'],
    ['gcfC4lT2mj0',36.122620868922525, -115.17038233886313,2765, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Las Vegas'],
    ['gcfC4lT2mj0',36.117949828514625, -115.17166929611284,4272, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Las Vegas'],
    ['gcfC4lT2mj0',36.115322568368626, -115.17367909154801,531, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Las Vegas'],
    ['gcfC4lT2mj0',36.101604793421046, -115.1732311728788,6415, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Las Vegas'],
    ['vuWpEJ1JRUQ',37.793363170827774, -122.4060702564594,441, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','San Francisco'],
    ['frh97PBKay8',34.06794575788217, -118.40156826076559,1320, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Los Angeles'],
    ['iNd7CKmrdpY',10.032714, 105.788126 ,481,'VN','POPtravel','https://www.youtube.com/@poptravelorg','Can Tho' ],
    ['iNd7CKmrdpY',10.0367558,105.7910135 ,2252,'VN','POPtravel','https://www.youtube.com/@poptravelorg','Can Tho' ],
    ['JKL5S_boq-4',1.3048167,103.8326361,39,'SG','POPtravel','https://www.youtube.com/@poptravelorg','Singapore' ],
    ['JKL5S_boq-4',1.3007931,103.8403117,1213,'SG','POPtravel','https://www.youtube.com/@poptravelorg','Singapore' ],
    ['JKL5S_boq-4',1.2980133,103.8480229,2664,'SG','POPtravel','https://www.youtube.com/@poptravelorg','Singapore' ],
    ['RvJyagzLUes',10.6101058,104.1814367,421,'KH','POPtravel','https://www.youtube.com/@poptravelorg','Kampot' ],
    ['24o8YE-Mwd4',36.7674308,31.3880902,470,'TR','POPtravel','https://www.youtube.com/@poptravelorg','Side' ],
    ['dIKLONh7SB4',42.0669729,19.513625,33,'AL','POPtravel','https://www.youtube.com/@poptravelorg','Shkodër' ],
    ['dIKLONh7SB4',42.065909, 19.510200,2421,'AL','POPtravel','https://www.youtube.com/@poptravelorg','Shkodër' ],
    ['dIKLONh7SB4',42.068374, 19.511942,2690,'AL','POPtravel','https://www.youtube.com/@poptravelorg','Shkodër' ],
    ['9N6IpArMDG8',-34.55721829259971, -58.45155763856845,200,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Buenos Aires'],
    ['9N6IpArMDG8',-34.5579427,-58.4501807,510,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Buenos Aires'],
    ['I7TWfDFlSf4',-34.60862875630961, -58.374458816502546,1240,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Buenos Aires'],
    ['I7TWfDFlSf4',-34.60694698019424, -58.37574848477445,1654,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Buenos Aires'],
    ['I7TWfDFlSf4',-34.60895337398217, -58.38212817623477,64,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Buenos Aires'],
    ['fwUekhXJd5U',-25.59506587483902, -54.590725610383245,69,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Misiones'],
    ['_Lk6DCnmPLE',-34.592373876236294, -58.378693844533146,231,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Buenos Aires'],
    ['wRQ-vN3C0Ko',-34.60612318759173, -58.381690941223695,313,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Buenos Aires'],
    ['O1RyGdlmoLc',-34.60706564188459, -58.36616101403808,252,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Buenos Aires'],
    ['Dtxr7H9cpEc',-34.583844004597026, -58.39163494962098,93,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Buenos Aires'],
    ['DpvzLyuGtaI',-50.46891320343997, -73.03324494984098,300,'AR','Martin Recorre','https://www.youtube.com/@MartinRecorre','Santa Cruz'],
    ['QpO_uUjCM5c',50.0866367,14.4196876,1030,'CZ','POPtravel','https://www.youtube.com/@poptravelorg','Prague'],
    ['QpO_uUjCM5c',50.0859985,14.4148046,1335,'CZ','POPtravel','https://www.youtube.com/@poptravelorg','Prague'],
    ['QpO_uUjCM5c',50.086209769723936, 14.41345735432818,3904,'CZ','POPtravel','https://www.youtube.com/@poptravelorg','Prague'],
    ['ol1e2IZ45sw',-25.282562768391205, -57.63553727118099,891,'PAR','ManuTrip','https://www.youtube.com/@ManuTrip','Asuncion'],
    ['428KUrsOEeU',-25.284343453539265, -57.56769198018064,616,'PAR','ManuTrip','https://www.youtube.com/@ManuTrip','Asuncion'],
    ['FtQDfyhVSNg',-34.620281306186264, -58.37149449568235 ,1131,'AR','ManuTrip','https://www.youtube.com/@ManuTrip','Buenos Aires'],
    ['zyHOuffhsF4',-34.60849464976005, -58.37219289535865 ,189,'AR','ManuTrip','https://www.youtube.com/@ManuTrip','Buenos Aires'],
    ['zyHOuffhsF4',-34.60159425945439, -58.38551866601885 ,3349,'AR','ManuTrip','https://www.youtube.com/@ManuTrip','Buenos Aires'],
    ['fi3cltSV4cA',-25.686250079771224, -54.44794950241885,4099,'AR','ManuTrip','https://www.youtube.com/@ManuTrip','Misiones'],
    ['pghHgslBJgI',-34.58358471178038, -58.3911774746335,81,'AR','ManuTrip','https://www.youtube.com/@ManuTrip','Buenos Aires'],
    ['aiLw910PC3Y',-54.810821746131516, -68.3152866742151,154,'AR','ManuTrip','https://www.youtube.com/@ManuTrip','Ushuaia'],
    ['6ghlKAmlbkY',-41.121034981205426, -71.39681102306164,268,'AR','ManuTrip','https://www.youtube.com/@ManuTrip','Bariloche'],
    ['IBROyImKFZo',-23.596944252905963, -65.88318723584135,53,'AR','ManuTrip','https://www.youtube.com/@ManuTrip','Salta'],
    ['L4GEfzP09Sg',-26.829572714174326, -65.20440764697985,509,'AR','ManuTrip','https://www.youtube.com/@ManuTrip','Tucuman'],
    ['uRcpYz9lxZw',55.7664814781097, 37.620986278808545,351,'RU','WindowToMoscow','https://www.youtube.com/@WindowToMoscow','Moscow'],
    ['77bfP5qAar0',55.756118,37.6161097,64,'RU','WindowToMoscow','https://www.youtube.com/@WindowToMoscow','Moscow'],
    ['ZMHTdqngZfA',55.75356764468332, 37.62166782320351,72,'RU','WindowToMoscow','https://www.youtube.com/@WindowToMoscow','Moscow'],
    ['ZMHTdqngZfA',55.75301418846161, 37.622853682566515,454,'RU','WindowToMoscow','https://www.youtube.com/@WindowToMoscow','Moscow'],
    ['IOm_1-Qx744',55.73881335254801, 37.61029574547425,933,'RU','WindowToMoscow','https://www.youtube.com/@WindowToMoscow','Moscow'],
    ['uRcpYz9lxZw',55.7617247,37.6202726,753,'RU','WindowToMoscow','https://www.youtube.com/@WindowToMoscow','Moscow'],
    ['hmT3m4GBhJU',40.784622,-73.9591253,30, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','New York'],
    ['hmT3m4GBhJU',40.774314, -73.970380,680, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','New York'],
    ['hmT3m4GBhJU',40.77265742288223, -73.97149820965703,984, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','New York'],
    ['rDI1XWuz5tM',39.3092147,-119.6500964,237, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Nevada'],
    ['am6-ntPu-_0',40.7047082562976, -73.99511540940394,66, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','New York'],
    ['_RTB5Aeq3BU',34.10167341716042, -118.34096089715887,221, 'US', 'Traveling w/ Andrew', 'https://www.youtube.com/@TravelingwithAndrew','Los Angeles'],
    ['XxsMwnHeZes',48.14564986210154, 11.565785527245966,1560,'DE','POPtravel','https://www.youtube.com/@poptravelorg','Munich' ],
    ['sCw_gHM7q-Q',53.553151077864676, 10.005848720455502,18,'DE','POPtravel','https://www.youtube.com/@poptravelorg','Hamburg' ],
    ['7M36wpx_OfU',52.376282008479876, 9.740673894271058,7,'DE','POPtravel','https://www.youtube.com/@poptravelorg','Hanover' ],
    ['gA1aLQCCZQE',52.51392118526781, 13.378696152051283,3240,'DE','POPtravel','https://www.youtube.com/@poptravelorg','Berlin' ],
    ['gA1aLQCCZQE',52.51631158134281, 13.378436903451522,3641,'DE','POPtravel','https://www.youtube.com/@poptravelorg','Berlin' ],
    ['V5q8f_eluOg',54.59482020760334, -5.934534194681385,43,'IRE','POPtravel','https://www.youtube.com/@poptravelorg','Belfast' ],
    ['AWHkUszwLf4',35.6807522,139.7630938,65,'JAP','Taka Soyama','https://www.pexels.com/@taka-soyama-4618245/','Tokyo'],
    ['42Sq_ePHpCc',35.282887,129.0706587,828, 'SK','ZERO ONE', 'https://www.youtube.com/@zeroone_01','Busan'],
    ['nPKe55qvJl8',24.8566053,67.0157151,170,'PK','Walk This Way', 'https://www.youtube.com/@walkthisway001','Karachi'],
    ['nPKe55qvJl8',24.856195, 67.015195,900,'PK','Walk This Way','https://www.youtube.com/@walkthisway001','Karachi'],
    ['nPKe55qvJl8',24.8549319,67.0154156,1755,'PK','Walk This Way','https://www.youtube.com/@walkthisway001','Karachi'],
    ['Ad_QDNC_1g0',-23.5672806,-46.6496069,191,'BR','Walk This Way', 'https://www.youtube.com/@walkthisway001','Sao Paulo'],
    ['ZccG9pKupqU',20.5324549,-105.2894049,1,'MX','Travel Tours 4K', 'https://www.youtube.com/@Traveltoursin4k','Jalisco'],
    ['zs3SYMrdur0',20.7561162,-105.3408928,1,'MX','Travel Tours 4K', 'https://www.youtube.com/@Traveltoursin4k','Nayarit'],
    ['Ad_QDNC_1g0',-23.5672806,-46.6496069,191,'BR','Walk This Way', 'https://www.youtube.com/@walkthisway001','Sao Paulo'],
    ['rktKwPbXLZs',22.2846002,114.2135811,59,'CH','Lazy Explorer','https://www.youtube.com/@lazy_explorer','Hong Kong'],
    ['5ZcYgv9ffzU',37.0704012,-8.1081289,697,'PT','Walking Portugal','https://www.youtube.com/@Walking_Portugal','Quarteira'],
    ['5ZcYgv9ffzU',37.06696758422314, -8.102253299954697,1854,'PT','Walking Portugal','https://www.youtube.com/@Walking_Portugal','Quarteira'],
    ['DrkaBlrgwlA',13.7438432,100.5024166,185,'TH','Lazy Explorer','https://www.youtube.com/@lazy_explorer','Bangkok'],
    ['21BHGHBxKz4',30.043400, 31.236254,1858,'EG','Streets Of Ambience','https://www.youtube.com/@streetsambience6054','Cairo'],
    ['5d7-bxplgr8',49.2889298,-123.1182284,111,'CA','Zero One','https://www.youtube.com/@zeroone_01','Vancouver'],
    ['5d7-bxplgr8',49.2880387,-123.1142063,881,'CA','Zero One','https://www.youtube.com/@zeroone_01','Vancouver'],
    ['5d7-bxplgr8',49.28265316002172, -123.1182161055164,1612,'CA','Zero One','https://www.youtube.com/@zeroone_01','Vancouver'],
    ['5d7-bxplgr8',49.28596015370139, -123.11254286984651,2171,'CA','Zero One','https://www.youtube.com/@zeroone_01','Vancouver'],
    ['UqZYW3-MgnE',37.5006252,127.0255362,482,'SK','Watchers Club','https://www.youtube.com/@watchersclub','Seoul'],
    ['zUUT06KHbw8',46.62425461112303, 8.035429897480348,150,'SZ','Chris L','https://www.youtube.com/@christopherlzt','Grindelwald'],
    ['8fOxvqVbPvc',56.950837338520955, 24.104650581006652,662,'LTV','Streets Of Ambience','https://www.youtube.com/@streetsambience6054','Riga'],
    ['K4HWfOy93k8',20.6896872,-88.201725,112,'MX','Paseos de Aventura', 'https://www.youtube.com/@MiddleAgeAdventureWalks','Valladolid'],
    ['tHhTHoPcRB8',48.86042795329101, 2.3377860527069623,409,'FR','People Places & Events','https://www.youtube.com/@PeoplePlacesEvents','Paris']
    ]






const list = {
    'CLASICO': video_list,
    'INVERTIDO': video_list,
}









var x = document.getElementById("warning-container")
var myvid = document.getElementById('myvid');
var bool_map = false
var backvideo 




// initalize map
map = L.map('map').setView([0, 0], 2.4); 

L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en', {
    minZoom: 2,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

map.setMaxBounds([[150,200],[-150,-200]]);

//add marker to map
marker = L.layerGroup();
map.addLayer(marker)

function invsze(){
  map.invalidateSize();
}


active_playlist = video_list
var vid_index = start_id
Enable_marking = true
active_video = video_list[start_id]
video_coords = [active_video[1],active_video[2]]
player = new YT.Player("myvid", {
            videoId: active_video[0],
            playerVars: {
                autoplay: 1,
                mute: 1,
                controls: 0,
                rel : 0,
                fs : 0,
                modestbranding: 1,
                showinfo: 0,
                start: active_video[3],
                loop: 1,
                origin: "http://localhost:3000/multiplayer.html"
            },
            events: {
                onReady: onPlayerReady
            },
});



document.getElementById('speedrange').oninput = function(){
    player.setPlaybackRate(parseFloat((document.getElementById('speedrange')).value))
    document.getElementById('reduceSpeedButton').innerHTML = `x${(document.getElementById('speedrange')).value}`
};

document.getElementById('volumerange').oninput = function(){
    player.setVolume(parseFloat((document.getElementById('volumerange')).value))
};


function onPlayerReady(event) {
    if(gamemode == 'INVERTIDO'){
        document.getElementById('myvid').style.transform = 'rotate(180deg)'
        document.getElementById('myvid').style.top= '-80px';
        document.getElementById('myvid').style.left= '00%';
    }
    // Define custom control actions
    document.getElementById("rewindButton").addEventListener("click", rewindVideo);
    document.getElementById("reduceSpeedButton").addEventListener("click", reduceSpeed);
    player.setPlaybackQuality('highres')
    player.unMute()
    player.setVolume(30)
    

    var a = document.getElementById('credits');

    a.href = active_playlist[vid_index][6]
    a.innerHTML = `${active_playlist[vid_index][5]}`
    
    setTimeout(() => {  document.getElementById('howto').style.display = "none"; }, 4500)
}


//calculate distance
function distance_calc(user_guess, video_coords){
    const R = 6371e3; // metres
    const φ1 = user_guess[0] * Math.PI/180; // φ, λ in radians


    const φ2 = +video_coords[0] * Math.PI/180;
    const Δφ = (+video_coords[0]-user_guess[0]) * Math.PI/180;
    const Δλ = (+video_coords[1]-user_guess[1]) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    const d = (R * c)/1000; 
    return(d)
}



//marking function
function mark(e){
    marker.clearLayers();
    var coord = e.latlng;
    lat = coord.lat;
    lng = coord.lng;
    L.marker((e.latlng), {icon: color_list[color]}).addTo(marker);
    marker_coords = [coord.lat, coord.lng]
}

//show or hide map
function map_open() {

        if(bool_map == false){
         
           bool_map = true
        }
        else {
         
            bool_map = false
        }
}



//hide guess button after guessing and shows 'continue' button, viceversa otherwise
function switchbtn() {
    var x = document.getElementById("guess");
    var y = document.getElementById("continue");
    if (x.style.visibility != "hidden"){
        x.style.visibility = "hidden";
        y.style.visibility = "visible";
    }
    else{
        y.style.visibility = "hidden";
        x.style.visibility = "visible";
    }

}

//no-guess warning
function showWarning() {
    if (x.style.display = "none"){
        x.style.display = "block";
        setTimeout(() => {  x.style.display = "none"; }, 5000);
        
    }
    else{
        x.style.display = "none"
    }
}

//show distance btwn guess and answer
function showDistance() {
    var x = document.getElementById("h2");
    if (x.style.visibility != "hidden"){
        x.style.visibility = "visible";
    }
}




//point calculation
function calc_points(){
    if (distance <= 1){
        return(1300 + 30/distance )
    }  

    if (1 < distance & distance <= 3 ){
        return(1000 + 300/distance )
    }  

    if (3 < distance & distance < 10 ){
        return(800 + 300/distance )
    }  

    if (10 <= distance & distance <= 40 ){
        return(480 + 3000/distance )
    }  

    if (40 < distance & distance <= 500 ){
        return(400 + 3000/distance )
    }  

    if (500 < distance & distance <= 1000 ){
        return(370 + 3000/distance )
    }  

    if (1000 < distance & distance <= 5000 ){
        return(330 + 30000/distance )
    } 

    if (5000 < distance & distance <= 10000 ){
        return(300 + 30000/distance )
    }  

    if (10000 < distance){
        return(250)
    }  

    
}



function next(e) {
    if(document.getElementById('continue').innerHTML == 'Esperando a los jugadores'){
        console.log('no listo')
        socket.emit('player_unready')
        document.getElementById('continue').innerHTML = 'Continuar'
    }
    else{
            console.log('listo')
        socket.emit('player_ready')
        document.getElementById('continue').innerHTML = 'Esperando a los jugadores'
    }



}


socket.on('new_vid', index => {
    rounds += 1
    roundhtml.innerHTML = `${rounds}/${prround}`

    playing = true
    pausado = false
    
    //end()
    
    Enable_marking = true

    //update continue button
    document.getElementById('continue').innerHTML = 'Continuar'
    switchbtn()

    //clear all map layers
    if(marker.getLayers().length > 0){
        marker.clearLayers()
    }
    if(guessed){
    polyline.removeFrom(map)
    marker_coords.length = 0
    }
    map.removeLayer(vidmarker)

    //readjust map's zoom
    map.setView([0, 0], 2.4)
    map_open();

    //erase distance text
    document.getElementById("h2").innerHTML = "";
    showDistance()

    //close map modal
    document.getElementById('modal').close()


    //data will be video list index

    //get new video
    var newvid = video_list[index]
    vid_index = index
    active_video = newvid
    video_coords = [active_video[1],active_video[2]]
    console.log(newvid)


    //update video
    player.loadVideoById(newvid[0],newvid[3]);


    //update credits
    var a = document.getElementById('credits');
    a.href = active_playlist[vid_index][6]
    a.innerHTML = `${active_playlist[vid_index][5]}`
        
    time = abstime
    pausado = false
    //start timer
    startTimer()


})




socket.on('end', scores =>{
    console.log(scores)
    func(scores, false)
    document.getElementsByClassName('pre')[0].style.display = 'block'
    document.getElementById('room_id_container').style.display = 'none'
    document.getElementsByClassName('post')[0].remove()
    player.pauseVideo()
})

    




function startTimer(){
   
    clearTimeout(interval)
    looptime()


}

function looptime(){
    if(time < 1){
        final_guess(false)
    }
    else{
       interval = setTimeout(function() {
          updatetime()
        }, 1000);
    }
    
}

function updatetime(){

    if(pausado == false){
        time = time - 1
        timer.innerHTML = `${time}s`
        looptime()
        if(time <= 10 && playing){
            playing = false
            document.getElementById('tic').play()
            
        }
    }
    

}

function pause(){
    if(gamemode == 'PAUSE'){
        player.pauseVideo()
        document.getElementById('pausebutton').style.display = 'none'
        document.getElementById('playbutton').style.display = 'block'
    }
}



function play(){
    if(gamemode == 'PAUSE'){
        player.playVideo()
        document.getElementById('playbutton').style.display = 'none'
        document.getElementById('pausebutton').style.display = 'block'
    }
}


//guessing secuence 
//c == false => user made no guess, otherwise user guessed

function final_guess(c) {
    playing = false
    document.getElementById('tic').currentTime = 0
    document.getElementById('tic').pause()
    
    //if user didn't guess
    if(c == false){
        guessed = false
        console.log('didnt press guess')
        
        guessed = false
        document.getElementById('modal').showModal()
        invsze()
        
        Enable_marking = false
        try{
            //if user didn't place marker on map
           if (marker_coords[0] == null ||  marker_coords[1] == null){
                //give 0 points
                score = 0
                
                document.getElementById("h2").innerHTML = "El tiempo acabo! ";

            
                socket.emit(`user_guessed`,([username,0,0,0,color, 0]))

                switchbtn()

               return
           }
       }
       catch(err){
        //give 0 points
        score = 0

        document.getElementById("h2").innerHTML = "El tiempo acabo! ";

        socket.emit(`user_guessed`,([username,0,0,0,color, 0]))
        switchbtn()
        return
        }     
        
        guessed = true
        Enable_marking = false

        //calculate distance between user's guess and vid coords
        distance = distance_calc([marker_coords[0], marker_coords[1]], video_coords)
    
        switchbtn()
    
        //calculate points
        var point = Number(calc_points())
        
        socket.emit(`user_guessed`,([username,marker_coords[0],marker_coords[1],point.toFixed(0),color,distance]))
    
        socket.on('player_guessed', () => {
            
        })
    
    

    
        //draw line between the 2 markers
        var latlngs = [];
        latlngs.push(L.latLng(marker_coords[0],marker_coords[1]));
        latlngs.push(L.latLng(video_coords[0],video_coords[1]));
        polyline = L.polyline(latlngs, {color: 'black'})
        try{polyline.addTo(map);}
        catch(err){
            
            showWarning()
            return
        }    
    
        //zoom into line
        map.fitBounds(polyline.getBounds());
    
    
        //display distance from guess to right answer
        if(distance < 1){
            document.getElementById("h2").innerHTML = "El tiempo acabo! " + Number((Number((distance))*1000).toFixed(0)) + " M";
        }
        else{
        document.getElementById("h2").innerHTML = "El tiempo acabo! " + Number((distance).toFixed(2)) + " KM";
        }
        showDistance()
        }

    else{
        guessed = true

        pausado = true
        try{
             //if user tried guessing without clicking map show warning
            if (marker_coords[0] == null ||  marker_coords[1] == null){
               
                showWarning()
                return
            }
        }
        catch(err){
           
            showWarning()
            return
    
        }

    Enable_marking = false




    //calculate distance between user's guess and vid coords
    distance = distance_calc([marker_coords[0], marker_coords[1]], video_coords)
    if(distance <= 10){
        document.getElementById('cheers').play()
        document.getElementById('cheers').addEventListener("ended", function(){
            this.currentTime = 0;
            this.pause();
        });
    }
    switchbtn()



    //calculate points
    var point = Number(calc_points())




    
    socket.emit(`user_guessed`,([username,marker_coords[0],marker_coords[1],point.toFixed(0),color, distance]))



    //draw line between the 2 markers
    var latlngs = [];
    latlngs.push(L.latLng(marker_coords[0],marker_coords[1]));
    latlngs.push(L.latLng(video_coords[0],video_coords[1]));
    polyline = L.polyline(latlngs, {color: 'black'})
    try{polyline.addTo(map);}
    catch(err){
        
        showWarning()
        return
    }    

    //zoom into line
    map.fitBounds(polyline.getBounds());


    //display distance from guess to right answer
    if(distance < 1){
        document.getElementById("h2").innerHTML = Number((Number((distance))*1000).toFixed(0)) + " M";
    }
    else{
    document.getElementById("h2").innerHTML = Number((distance).toFixed(2)) + " KM";
    }
    showDistance()
    }


    
    //add marker on vid coords 
    vidmarker = L.layerGroup();
    var latlng = L.latLng(video_coords[0], video_coords[1]);
    var green_marker = L.marker((latlng), {icon: greenIcon})
        .addTo(vidmarker)
        .bindPopup(`${active_playlist[vid_index][7]}, ${country(active_playlist[vid_index][4])}`);
    map.addLayer(vidmarker);
    green_marker.openPopup();
    
    
    
}


socket.on('all_guessed', data => {
    console.log(marker.getLayers().length)
    //update scoreboard
    
    for(var k in data){
        //data format: {playerX1: [coord 1, coord 2, points, color],
        //              playerX2: [coord 1, coord 2, points, color],...}

        if(data[k][0] != 0 && data[k][1] != 0){
        

            var lsd = L.latLng(data[k][0], data[k][1]);

            
            L.marker((lsd), {icon: color_list[data[k][3]]}).addTo(marker)
            .bindPopup(`${k}`);
        }
        
        
        var table = document.getElementById('scoretable')
        for(let rw = 1; rw < table.rows.length; rw++){
            if(k == table.rows[rw].getElementsByClassName('username')[0].innerHTML){
                table.rows[rw].getElementsByClassName('points')[0].innerHTML = parseInt(table.rows[rw].getElementsByClassName('points')[0].innerHTML) + parseInt(data[k][2])
            }
        }

    }
    map.setView([0, 0], 2.4)

})


socket.on('player_guessed', data => {
    //data = [user, distance]
    document.getElementById('nice').play()
    var x = document.createElement('div');
    x.innerHTML = `${data[0]} adivinó! <br>  (${data[1]} KM)`
    x.classList.add('notif');
    x.setAttribute("id", `${data[0]}` )
    document.getElementById("notif-placeholder").prepend(x);
    setTimeout(function(){
        document.getElementById(data[0]).remove();
   },3000);
});



map.on('click', function(e){
    if (Enable_marking == true){
        mark(e)
    }
});



function rewindVideo() {
    
    const currentTime = player.getCurrentTime();
    if(currentTime >= 5 + active_video[3]){
        player.seekTo(currentTime - 5, true); 
    }
    else{
        player.seekTo(active_video[3], true);
    }
}

function reduceSpeed() {
   
    const currentPlaybackRate = player.getPlaybackRate();
    player.setPlaybackRate(currentPlaybackRate - 0.25); // You can adjust the speed reduction factor
}

function restartVideo(){
    player.seekTo(active_video[3], true);
}

document.addEventListener('keydown', (event) => {
    var name = event.key;
    console.log(name)
    var x = document.getElementById("guess");
    if (name === 'Enter' && bool_map) {
        if (x.style.visibility != "hidden"){
           
            final_guess()
        }
        else{
            next()
        }
    }
    if (name == ' ' && gamemode == 'PAUSE'){
      
        if(document.getElementById('pausebutton').style.display == 'none'){
            play()
        }
        else{
            pause()
        }
    }
    if(name == 'MediaPlayPause'){
        player.playVideo()
    }
    if (name === 'm') {
        document.getElementById('modal').showModal()
        invsze()
    }
    if (name === 'ArrowLeft') {
        var currentPlaybackRate = player.getPlaybackRate(); 
        player.setPlaybackRate(currentPlaybackRate - 0.25);
        document.getElementById('speedrange').value = currentPlaybackRate - 0.25;
        document.getElementById('reduceSpeedButton').innerHTML = `x${(document.getElementById('speedrange')).value}`;
    }
    if (name === 'ArrowRight'){
        var currentPlaybackRate = player.getPlaybackRate();
        player.setPlaybackRate(currentPlaybackRate + 0.25);
        document.getElementById('speedrange').value = currentPlaybackRate + 0.25;
        document.getElementById('reduceSpeedButton').innerHTML = `x${(document.getElementById('speedrange')).value}`;
    }
})


window.onclick = function(event) {
    if (event.target == modal) {
      modal.close()
    }
}


if (window.performance.getEntriesByType) {
    if (window.performance.getEntriesByType("navigation")[0].type === "reload") {
        window.location.href = './index.html';
    }
}