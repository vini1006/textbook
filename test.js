const fs = require('fs').promises;
const constants = require('fs').constants;

fs.access('./folder', constants.F_OK | constants.W_OK | constants.R_OK)
    .then(() => {
        return Promise.reject("이미 폴더 있음");
    })
    .catch((err) => {
        if (err.code === 'ENOENT') {
            console.log("폴더 없음");
            return fs.mkdir('./folder')
        }
        return Promise.reject(err);
    })
    .then(() => {
        console.log('folder 만들기 성공');
        return fs.open('./folder/file.js','w');
    })
    .then((fd) => {
        console.log('빈파일 만들기 성공', fd);
        let newName = './folder/newFile.js';
        return [fs.rename('./folder/file.js', newName), newName];
    })
    .then((val) => {
        console.log('이름 바꾸기 성공');
        return val[1];
    })
    .then((val) => {
        fs.writeFile(val , 'babo').then(()=>{console.log('성공');});
    })
    .catch((err) => {
        console.error('어디선가 끊김',err);
    })
