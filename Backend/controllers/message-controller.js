const Group = require('../models/group');
const Message=require('../models/message');
const User = require('../models/user');




//endpoints to POST messages and to store it in the backend

// const messagess=async(req,res)=>{

//     try{

//         console.log("***********")
// console.log('d',req.body,"???????????????")
//         const {senderId,recepientId,groupId,messageType,messageText}=req.body
        
// console.log(senderId,recepientId,messageType,messageText,"???")
//         const newMessage= new Message({
//             senderId,
//             recepientId,
//             groupId,
//             messageType,
//             message:messageText,
//             timestamp:new Date(),
//             imageUrl:messageType=='image'?req.file.path:null
//         })
 
//         console.log(newMessage,"NUU")
//         await newMessage.save();
      
//         console.log("GGG")
//         res.status(200).json(newMessage)

//     }catch(err){

//         console.log("error in posting msg",err)

//         res.status(500).json({message:"internal server error"})

//     }

// }


const messagess = async (req, res) => {
    try {
      const { senderId, recepientId, groupId, messageType, messageText,imageUrl } = req.body;
  
    //   let imageUrl = null;
    //   if (messageType === 'image' && req.file) {
    //     console.log(req.file,"FIIIIIIIIIIIIELLLLLLLLE")
    //     const file = req.file;
    //     const filePath = `chat/${Date.now()}_${file.originalname}`;
    //     await bucket.upload(file.path, {
    //       destination: filePath,
    //       metadata: {
    //         contentType: file.mimetype,
    //       },
    //     });
  
    //     imageUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    //   }

    console.log(req.body,"????????????????????",senderId)
  
      const newMessage = new Message({
        senderId,
        recepientId,
        groupId,
        messageType,
        message: messageText,
        timestamp: new Date(),
        imageUrl: imageUrl,
      });
  
      await newMessage.save();
      res.status(200).json(newMessage);
    } catch (err) {
      console.log('error in posting msg', err);
      res.status(500).json({ message: 'internal server error' });
    }
  };



//endpoints to get user details in chat header bar

const userDetails=async(req,res)=>{
    try{

        const {userId}=req.params
        console.log("user",userId)

        const user=await User.findById(userId);

        res.json(user);


    }catch(err){

        console.log("error in retrieving user details",err)

        res.status(500).json({message:"internal server error"})

    }
}



//endpoints to get group details in chat header bar

const groupDetails=async(req,res)=>{
    try{

        const {groupId}=req.params
        console.log("user",groupId)

        const group=await Group.findById(groupId);

        console.log("GOrup",group)

        res.json(group);


    }catch(err){

        console.log("error in retrieving user details",err)

        res.status(500).json({message:"internal server error"})

    }
}






//endpoints to fetch messages between the users in chatroom


const chatMessages=async(req,res)=>{
    try{
console.log("qq")
        const {senderId,recepientId,groupId}=req.body
console.log(senderId, recepientId,groupId)

let messages;

        if(groupId){
console.log("G")
            messages=await Message.find({groupId}).populate("senderId","_id name")

        }
        else if(senderId && recepientId){
            console.log("R")

            messages=await Message.find({
                $or:[
                    {senderId:senderId,recepientId:recepientId},
                    {senderId:recepientId,recepientId:senderId},
                ],
            }).populate("senderId","_id name")

        }else{

            return res.status(400).json({ message: "Either groupId or senderId and recepientId must be provided" });

        }
        
        

        console.log("ff",messages)
        res.json(messages)
        console.log("s",messages)

    }catch(err){
        console.log("error in retrieving messages",err)

        res.status(500).json({message:"internal server error"})

    }
}




module.exports={
    messagess,
    userDetails,
    groupDetails,
    chatMessages
}