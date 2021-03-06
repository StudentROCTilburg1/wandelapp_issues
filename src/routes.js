import * as $ from 'jquery';

/**
 * Read json from remoteserver
 * @param remoteserver
 * @returns {Promise}
 */

console.log(Promise);

const getroutesjson = (remoteserver) => {
    return new Promise((resolve, reject) => {
        fetch(remoteserver)
        .then(response => {
            return response.json();
      })
      .then((myJson)=>{
          var routesjson = myJson.map((f)=>{
              return {data : f};
          });
          resolve(routesjson);
      })
      .then((fail)=>{
          reject(fail);
      });
    });
};

/**
 * Post a textfile to the remoteserver
 * @param remoteserver
 * @param file
 * @returns {Promise}
 */
const posttextfile = (remoteserver = "", file = "") => {
    return new Promise((resolve, reject) => { //New promise for array
        const reader = new FileReader();
        //Send contents file when read
        reader.onloadend = (e) => {
            const contents = e.target.result;

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const res = JSON.parse(xhr.response);
                        console.log('er is een error');
                        console.log(res);
                        if (res.error === true) {
                            reject(res.msg);
                            // console.log('er is een error');
                        } else {
                            resolve();
                        }
                    } else {
                        reject("Problem posting " + xhr.status);
                    }
                }
            };

            xhr.open("POST", remoteserver);
            xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
            xhr.send(contents);
        };
        reader.readAsText(file);
    });
};

//expose ajax functions
exports.getroutesjson = getroutesjson;
exports.posttextfile = posttextfile;
