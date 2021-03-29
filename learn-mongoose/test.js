async function f1 () {
    await f2();
    console.log(3);
    await f3();
    return console.log(4);
}

function delay(time){
   return new Promise(resolve => setTimeout(resolve, time));
}


async function f2() {
    await delay(1000);
    return 'f22';
}
async function f3() {
    await delay(1000);
    return 'f33';
}




f1();

