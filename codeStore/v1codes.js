
  app.get('/videocomponent', (req, res) => {
    console.log('reached here');
    const range = req.headers.range
    const videoPath = './samplevideos/sample-5s.mp4';
    const videoSize = fs.statSync(videoPath).size
    console.log(videoSize);
    const chunkSize = 1 * 1e6;
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + chunkSize, videoSize - 1)
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers)
    const stream = fs.createReadStream(videoPath, {
        start,
        end
    })
    stream.pipe(res)
    const videoKey = req.params.id;
    const videoStream = getVideo(videoKey);
    console.log(videoStream);
    videoStream.pipe(res);
  });



    app.get('/dashboard/:user/:subject/:level', isLoggedIn, asyncWrapper(async(req, res) => {
      const {search} = req.query;
      const {subject, level} = req.params;
      if (search) {
        const data = await Content.find({$text: {$search: search}, subject: subject, level: level}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}});
        console.log(data);
        const {username, email} = req.user;
        if (username==='0775527077' && email ==='twaninetschool@gmail.com') {
          res.render('user/adminDashboard', {data, isAllUsers: false, subject, level, activeMenuItem: '', resultdescription:`${subject}, ${level}, ${search}`});
        }else{
          res.render('user/dashboard', {data, subject, level, activeMenuItem: '', resultdescription:`${subject}, ${level}, ${search}`});
        }    
      }else{   
        const data = await Content.find({subject: subject, level: level});
        if(req.user.username==='0775527077' && req.user.email ==='twaninetschool@gmail.com' ){
          res.render('user/adminDashboard', {data, isAllUsers: false, subject, level, activeMenuItem: '', resultdescription:''});
        }else{
          res.render('user/dashboard', {data, subject, level, activeMenuItem: '', resultdescription:''});
        }
      }
    }));



    app.get('/videoplayer/:fileId', asyncWrapper(async(req, res) => {
      const videoFileDocuent = await Content.findById(req.params.fileId);
        // const range = req.headers.range
        // if (!range) {
        //     res.status(400).send("Requires Range header");
        // }
        const videoKey = videoFileDocuent.videoKey;
        // const videoSize = videoFileDocuent.videoSize;
        // const chunkSize = 1 * 1e6;
        // const start = Number(range.replace(/\D/g, ""))
        // const end = Math.min(start + chunkSize, videoSize - 1)
        // const contentLength = end - start + 1;
        // const headers = {
        //     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        //     "Accept-Ranges": "bytes",
        //     "Content-Length": contentLength,
        //     "Content-Type": "video/mp4"
        // }
        // res.writeHead(206, headers)
  
        const videoStream = getVideo(videoKey);
  
        // const stream = fs.createReadStream(videoKey, {
        //     start,
        //     end
        // })
        // stream.pipe(res)
  
        
        videoStream.pipe(res);
    }))

