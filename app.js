// app configuration
var mongoose  =  require("mongoose"),
bodyParser    =  require("body-parser"),
express       =  require("express"),
nodemailer	  =  require("nodemailer"),
path          =  require("path"),
multer        =  require("multer"),
app           =  express();

// set storage engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req,file,cb){
		cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
	}
});

const upload = multer({
	storage:storage
}).single('cv');

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//rendering ejs pages
app.get("/",function(req, res) {
    res.render("home");
});
app.get("/abodes",function(req,res){
    res.render("abodes");
});
app.get("/abodes/projects",function(req,res){
    res.render("projects");
});
app.get("/abodes/careers",function(req,res){
    res.render("careers");
});
app.get("/kitchens",function(req,res){
    res.render("kitchens");
});
//sends client details from message form to admin
app.post("/message",function(req,res){
	var output=`
		<p>You have a new contact request</p>
		<h3>Contact Details</h3>
		<ul>
			<li>Name : ${req.body.name}</li>
			<li>E-Mail : ${req.body.email}</li>
			<li>Phone Number : ${req.body.phone}</li>
			<li>Address : ${req.body.address}</li>
			<li>Type of Property : ${req.body.property}</li>
		</ul>
		<h3>Message : </h3>
		<p>${req.body.message}</p>
	`;
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
    	port: 465,
    	secure: true, 
		auth: {
		  user: "tdhankhar@gmail.com",
		  pass: "eoivfwvmxzckrzuf"
		}
	  });

	  let mailOptions = {
		from: '"Adorn Abodes" tdhankhar@gmail.com', // sender address
		to: "tanukimumy@gmail.com", // list of receivers
		subject: "Client Details", // Subject line
		text: "Hi! Adorn Abodes ", // plain text body
		html: output
	  };

	  transporter.sendMail(mailOptions,function(err,data){
		  if(err){
			  console.log("Error Occured",err);
		  }else{
			  console.log("Mail Sent");
		  }
	  });
	res.redirect("abodes");
});
var fileName = "";
var location = "";
//upload resume to server
app.post("/upload",function(req,res){
	upload(req,res,(err)=>{
		if(err){
			console.log(err);
		}else{
			fileName = req.file.filename;
			location = req.file.path;
			console.log(req.file);
		}
	});
	res.redirect("abodes/careers");
});
//sends resume details from join us form to admin
app.post("/apply",function(req,res){
	console.log(req.body);
	var output=`
		<p>You have a new joining request</p>
		<h3>Candidate Details</h3>
		<ul>
			<li>Name : ${req.body.name} ${req.body.lastName}</li>
			<li>E-Mail : ${req.body.email}</li>
			<li>Phone Number : ${req.body.phone}</li>
			<li>Interests : ${req.body.detail}</li>
		</ul>
	`;
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
    	port: 465,
    	secure: true, 
		auth: {
		  user: "tdhankhar@gmail.com",
		  pass: "eoivfwvmxzckrzuf"
		}
	  });
	  console.log(fileName);
	  console.log(location);
	  let mailOptions = {
		from: '"Adorn Abodes" tdhankhar@gmail.com', // sender address
		to: "tanukimumy@gmail.com", // list of receivers
		subject: "Client Details", // Subject line
		text: "Hi! Adorn Abodes ", // plain text body
		html: output,
		attachments: [
			{
				filename: fileName,
				path: location
			}
		]
	  };

	  transporter.sendMail(mailOptions,function(err,data){
		  if(err){
			  console.log("Error Occured",err);
		  }else{
			  console.log("Mail Sent");
		  }
	  });
	res.redirect("abodes/careers");
});
//server call
app.listen(3000,function(){
    console.log("server has started!!");
});