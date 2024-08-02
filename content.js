chrome.storage.sync.get(['isScriptEnabled'], function (result) {
    if (result.isScriptEnabled) {
        function checkDone($html,assignmentName){
            let done=1;
            let checkString=$html.find(`:contains(\"${assignmentName}\")`).parent(".mod-indent-outer").find(".actions").find(".autocompletion").children(":eq(0)").attr("class");
            if(checkString && checkString[checkString.length-1]=='n') done=0;
            return done;
        }

        function justFetch(url){
            return new Promise((resolve,reject)=>{
                $.ajax({
                    url: url,
                    method: 'GET',
                    xhrFields: {
                        withCredentials: true // 쿠키를 포함하여 요청을 보냄
                    },
                    success: function(data) {
                        // 원하는 변수를 사용하여 HTML 데이터 저장
                        let $html=$(data);
                        resolve($html);
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
            });
        }
        async function fetchHTML(href,year,month,day) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: href,
                    method: 'GET',
                    xhrFields: {
                        withCredentials: true // 쿠키를 포함하여 요청을 보냄
                    },
                    success: function(data) {
                        // 원하는 변수를 사용하여 HTML 데이터 저장
                        let $html = $(data);
                        let doneurl=$html.find(".site-info").find("h1").find("a").attr("href");
                        let expireDate = $html.find(".card:eq(2)").text();
                        let endyear = parseInt(expireDate.substr(33, 4));
                        let endmonth = parseInt(expireDate.substr(38, 2));
                        let endday = parseInt(expireDate.substr(41, 2));
                        let endhour = parseInt(expireDate.substr(44, 2));
                        let endmin = parseInt(expireDate.substr(47, 2));
                        let differ = 365 * (endyear - year) + 30 * (endmonth - month) + (endday - day);
                        resolve({ differ, doneurl});
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
            });
        }

        async function reloadAssignments(){
            const className="calendarmonth calendartable mb-0 table table-coursemos table-bordered";
        
            let tables = document.getElementsByClassName(className);
            
            let rows=tables[0].getElementsByTagName("tr"); // rows for 4-5 weeks of month
            
            const assignmentMap=new Map();
            const urlMap=new Map();

            for(let i=1;i<rows.length;i++){
                let ul=rows[i].getElementsByTagName("ul"); // ul HTMLCollection for rows
                let daysOfThisWeek=rows[i].getElementsByClassName("day text-sm-center text-md-left clickable");
                for(let j=0;j<ul.length;j++){
                    let a=ul[j].getElementsByTagName("a"); // a HTMLCollection for uls
                    let dateInfo=daysOfThisWeek[j].getElementsByTagName("a")[0];
                    let day=parseInt(dateInfo.getAttribute("data-day"));
                    let month=parseInt(dateInfo.getAttribute("data-month"));
                    let year=parseInt(dateInfo.getAttribute("data-year"));
                    // console.log(`${year}/${month}/${day}`);
                    for(let k=0;k<a.length;k++){
                        let curString=a[k].title;
                        let href=a[k].getAttribute("href"); // get url to crawling
                        if(assignmentMap.has(curString)) a[k--].remove();
                        else{
                            assignmentMap.set(curString,1);
                            assignmentMap.set(curString, 1);
                            if (href) {
                                try {
                                    let { differ, doneurl } = await fetchHTML(href,year,month,day);
                                    let done;
                                    if(!urlMap.has(doneurl)){
                                        let $tmp=await justFetch(doneurl);
                                        urlMap.set(doneurl,$tmp);
                                    }
                                    let $html=urlMap.get(doneurl);
                                    done=checkDone($html,curString);
                                    // console.log(`${endyear}/${endmonth}/${endday}/${differ}/${done}`);
                                    if(done==1) a[k].style.color="green";
                                    if (differ>0) a[k--].remove();
                                } catch (error) {
                                    console.error('Error fetching HTML:', error);
                                }
                            } else {
                                console.error('No href found for the selected a tag');
                            }
                        }
                    }
                }
            }
        }
        
        reloadAssignments();
        
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.url) {
            //   console.log(`URL changed to: ${message.url}`);
                reloadAssignments();
            }
        });
    }
});