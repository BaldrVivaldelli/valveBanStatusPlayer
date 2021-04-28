var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

/* post profileStatus listing. */
router.post('/checkStatus', function(req, res, next) {
  console.log('url profile ' + req.body.steamIdPlayer);
  let steamProfileUrl = req.body.steamIdPlayer;

    const getSteamData = async()=>{        
        const banStatus = fetchSteamBanStatus(steamProfileUrl)
        const profileInformation = fetchUnusefullButNecesaryUXData(steamProfileUrl);
        return  await Promise.all([banStatus,profileInformation]);
    }
    getSteamData().then(data=>{      
      let playerStatus = data[0];
      let profileInfo = data[1];      
      console.log(profileInfo);
      res.render('profileResult', 
         { title: 'Steam url profile', 
           communityBanned: playerStatus.CommunityBanned , vacBanned: playerStatus.VACBanned,
           numberOfVACBans: playerStatus.NumberOfVACBans, daysSinceLastBan: playerStatus.DaysSinceLastBan, numberOfGameBans: playerStatus.NumberOfGameBans,
           personName: profileInfo.personanem, avatar: profileInfo.avatarfull, steamid: profileInfo.steamid, country: profileInfo.loccountrycode

         }
      )
    });  
});

function fetchSteamBanStatus(steamProfileUrl){
  let steamId = steamProfileUrl.split("https://steamcommunity.com/profiles/");
  let apikey = '97AEECD3111F7882C943221ABF492465'
  return fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apikey}&steamids=${steamId[1]}`
    ).then(res=>{
      if(res.ok){
        return res.json()
      }else{
        throw Error("El link de ese perfil no existe")
      }
    }).then(data=>{
      console.log('llegue a vac info')
      return data.players[0];
    })       
}

function fetchUnusefullButNecesaryUXData(steamProfileUrl){
  console.log('profile info ' + steamProfileUrl);
  let steamId = steamProfileUrl.split("https://steamcommunity.com/profiles/");
  let apikey = '97AEECD3111F7882C943221ABF492465'  
  let url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apikey}&steamids=${steamId[1]}`;
  console.log('la url es la sigueinte ' + url);
  return fetch(        
    url
    ).then(res=>{
      if(res.ok){
        return res.json()
      }else{
        throw Error("El link de ese perfil no existe")
      }
    }).then(data=>{
      console.log('llegue a profile info')      
      return data.response.players[0];
    }) 
}

module.exports = router;
