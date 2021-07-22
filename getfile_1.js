var fs = require('fs');
var join = require('path').join;
var videopath = 'D:/t111/nosound/';
var audiopath_1 = 'D:/t111/wave/cow-mic1';
var audiopath_2 = 'D:/t111/wave/cow-mic3';

var audio_buffer_1 = 'C:\\Users\\32649\\Downloads\\0.wav'
var audio_buffer_2 = 'C:\\Users\\32649\\Downloads\\00.wav'
var merge_audio_buffer = 'C:\\Users\\32649\\Downloads\\name.wav';
var final_video_buffer = 'C:\\Users\\32649\\Downloads\\outPutFile3.mp4';

function Merge_Audio_Video(audio,video,save){
    var concateExec = require('child_process').exec
        var child = concateExec('ffmpeg -i ' + audio + ' -i ' + video + ' -shortest -c:a aac ' + save, function (error, stdout, stderr) {
            if (error !== null) {
                console.log('concateExec error: ' + error);
            }
            child;
        });
}

function Merge_Audio(){
    var concateExec = require('child_process').exec
        var child = concateExec("ffmpeg -i " + audio_buffer_1 + " -i " + audio_buffer_2 + " -filter_complex \"[0:a][1:a]concat=n=2:v=0:a=1[out]\" -map \"[out]\" " + merge_audio_buffer, function (error, stdout, stderr) {
            if (error !== null) {
                console.log('concateExec error: ' + error);
            }
            child;
        });
}

function Cut_Audio(audio,start_time, continue_time,name){
    save = 'C:\\Users\\32649\\Downloads\\'+ name +'.wav'
    var concateExec = require('child_process').exec
        var child = concateExec('ffmpeg -ss ' + start_time +' -t ' + continue_time + ' -i ' + audio + save, function (error, stdout, stderr) {
            if (error !== null) {
                console.log('concateExec error: ' + error);
            }
            child;
        });
}

function Get_Files(Path){
    let Files = []
    function findFile(path){
        let files = fs.readdirSync(path);
        files.forEach(function (item, index) {
            let fPath = join(path,item);
            let stat = fs.statSync(fPath);
            if(stat.isDirectory() === true) {
                findFile(fPath);
            }
            if (stat.isFile() === true) { 
                Files.push(fPath);
            }
        });
    }
    findFile(Path);
    Files.sort()
    Files.reverse();
    // console.log(Files);
    return Files;
}



function Find_Mic1(video, v_date, v_hr, v_min, v_sec){
    num = ''
    for(i = 0; i < audioname1.length; i++){
        if(num == '00'){
            setTimeout(Merge_Audio,200);
            setTimeout(Merge_Audio_Video, 300, merge_audio_buffer,video,final_video_buffer);
            break
        }   
        s_hr = audioname1[i].substring(40,42)
        s_min = audioname1[i].substring(42,44)
        s_sec = audioname1[i].substring(44,46)
        if(Math.abs(parseInt(v_hr) - parseInt(s_hr)) < 1){
            if(Math.abs(parseInt(v_min) - parseInt(s_min)) <= 5){ //正常情況 ex. v:140151 a:140208
                start_time = 0
                continue_time = (parseInt(s_min) - parseInt(v_min)) * 60 + parseInt(s_sec) - parseInt(v_sec)
                // console.log(audioname1[i])
                // console.log(start_time + " " + continue_time)
                num = num + '0'
                Cut_Audio(audioname1[i]+' ',start_time,continue_time,num)
            }
        }
        else if((Math.abs(parseInt(v_hr) - parseInt(s_hr)) == 1)){
            if(Math.abs(parseInt(v_min) - parseInt(s_min) + 60) <= 5){ //不正常情況 ex. v:140151 a:135708
                continue_time = ((parseInt(v_min) - parseInt(s_min)) + 60) * 60 - parseInt(s_sec) + parseInt(v_sec)
                start_time = 300 - continue_time
                // console.log(audioname1[i])
                // console.log(start_time + " " + continue_time)
                num = num + '0'
                Cut_Audio(audioname1[i]+' ',start_time,continue_time,num)
            }
        }
    }
}

videoname = Get_Files(videopath);
v_date = videoname[3].substring(16,24)
v_hr = videoname[3].substring(25,27)
v_min = videoname[3].substring(27,29)
v_sec = videoname[3].substring(29,31)
console.log(v_date + "  " + v_hr + " " + v_min + " " + v_sec)
audioname1 = Get_Files(audiopath_1 + '/' + v_date)
// s_date1 = audioname1[0].substring(31,39)
// s_hr1 = audioname1[0].substring(40,42)
// s_min1 = audioname1[0].substring(42,44)
// s_sec1 = audioname1[0].substring(44,46)
// console.log(s_date1 + "  " + s_hr1 + " " + s_min1 + " " + s_sec1)
audioname2 = Get_Files(audiopath_2 + '/' + v_date);
// s_date2 = audioname2[0].substring(31,39)
// s_hr2 = audioname2[0].substring(40,42)
// s_min2 = audioname2[0].substring(42,44)
// s_sec2 = audioname2[0].substring(44,46)
// console.log(s_date2 + "  " + s_hr2 + " " + s_min2 + " " + s_sec2)

Find_Mic1(videoname[3], v_date, v_hr, v_min, v_sec)
