async function getUser() { //로딩시 사용자 정보를 가져오는 함수
    try {
        const res = await axios.get('/users');
        const users = res.data;
        const list = document.getElementById('list');
        list.innerHTML = '';
        
        //사용자마다 반복적으로 화면 표시 및 이벤트 연결
        Object.keys(users).map(function(key) {
            const userDiv = document.createElement('div');
            const span = document.createElement('span');
            span.textContent = users[key];
            const edit = document.createElement('button');
            edit.textContent = '수정';

            edit.addEventListener('click', async () => {
                const name = prompt('바꿀 이름을 입력하세요.');
                if (!name) {
                    return alert('이름을 반드시 입력 하셔야 합니다.');
                }
                try {
                    await axios.put(`/user/${key}`, {name});
                    getUser();
                } catch(err) {
                    console.error(err);
                }
            });
            const remove = document.createElement('button');
            remove.textContent = '삭제';
            remove.addEventListener('click', async () => {
                try {
                    await axios.delete(`/user/${key}`);
                    getUser();
                } catch (err) {
                    console.error(err);
                }
            });
            userDiv.appendChild(span);
            userDiv.appendChild(edit);
            userDiv.appendChild(remove);
            list.appendChild(userDiv)
            console.log(res.data);
        });
    } catch(err) {
        console.error(err);
    }
}

window.onload = getUser;
// 폼 제출(submit)시 실행
document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('e는', e);
    console.log('e.target 는', e.target);
    const name = e.target.username.value;
    if(!name) {
        return alert('이름을 입력하세요!');
    }
    try {
        let res = await axios.post(`/user`, {name});
        alert(JSON.stringify(res));
        getUser();
    } catch (err) {
        console.error(err);
    }
    e.target.username.value = '';
}); 