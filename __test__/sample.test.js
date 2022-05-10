const request = require('supertest');
const app = require('../index.js');

let access_token = '';
let admin_access_token = '';

// User
describe('User Endpoints', () => {
  it('Login', async () => {
    const res = await request(app).post('/user/login').send({
        email: 'quanghuytran02072000@gmail.com',
        password: '123456'
    });

    expect(res.statusCode).toEqual(200);
    access_token = res._body.accessToken;
  });

  it('Admin Login', async () => {
    const res = await request(app).post('/user/login').send({
      email: 'admin@gmail.com',
      password: 'Admin123456'
    });

    expect(res.statusCode).toEqual(200);

    admin_access_token = res._body.accessToken;
  });
});

// Message
describe('Message Endpoints', () => {
    it('Access Conversation', async () => {
        const res = await request(app)
        .post('/message/access_conversation')
        .send({
            userId: "623c966102981f76be675a0d",
            userName: "admin"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    var _id = ""
    it('Access Conversation New', async () => {
        const res = await request(app)
        .post('/message/access_conversation')
        .send({
            userId: "6261161d70507080ff6b1361",
            userName: "Triệu Tấn Hùng"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
        _id =  res._body.conversation._id;
    });

    it('create message', async () => {
        const res = await request(app)
        .post('/message/create_message')
        .send({
            text: "test",
            conversationId: `${_id}`,
            members: ["6261161d70507080ff6b1361","624ab1431c48d7d8310c552c"]
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(201);
    });

    it('get conversations', async () => {
        const res = await request(app)
        .get('/message/get_conversations')
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('get messages', async () => {
        const res = await request(app)
        .get(`/message/get_messages/${_id}`)
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('get messages not found', async () => {
        const res = await request(app)
        .get('/message/get_messages/62761156a09f46a53a0ed75a6')
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(404);
    });

    it('seen message', async () => {
        const res = await request(app)
        .patch('/message/seen_message')
        .send({
            id: `${_id}`
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('seen message not found', async () => {
        const res = await request(app)
        .patch('/message/seen_message')
        .send({
            id: "1234567889"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(404);
    });

    it('delete conversation', async () => {
        const res = await request(app)
        .delete(`/message/delete_conversation/${_id}`)
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('create group not enough members', async () => {
        const res = await request(app)
        .post('/message/create_group')
        .send({
            members: ["62504fd55133ea41f9474cf3"],
            name: "Nhóm test"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(400);
    });

    it('create group', async () => {
        const res = await request(app)
        .post('/message/create_group')
        .send({
            members: ["62504fd55133ea41f9474cf3","6261161d70507080ff6b1361"],
            name: "Nhóm test"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
        _id =  res._body.conversation._id;
    });

    it('rename', async () => {
        const res = await request(app)
        .patch('/message/rename')
        .send({
            conversationId: `${_id}`,
            name: "Test Rename"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('group add', async () => {
        const res = await request(app)
        .patch('/message/group_add')
        .send({
            conversationId: `${_id}`,
            userId: "623c966102981f76be675a0d"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('group add not found', async () => {
        const res = await request(app)
        .patch('/message/group_add')
        .send({
            conversationId: "623c966102981f76be675a0d",
            userId: "623c966102981f76be675a0d"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(404);
    });

    it('group move', async () => {
        const res = await request(app)
        .patch('/message/group_move')
        .send({
            conversationId: `${_id}`,
            userId: "623c966102981f76be675a0d"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('group move not include member', async () => {
        const res = await request(app)
        .patch('/message/group_move')
        .send({
            conversationId: `${_id}`,
            userId: "623d62058078022be28bd9f6"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('Get 1 Conversation', async () => {
        const res = await request(app)
        .patch(`/message/${_id}`)
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(404);
    });

});

// Notify
describe('Notify Endpoints', () => {
    var _id = ""
    it('create_notify_like_tour', async () => {
        const res = await request(app)
        .post('/notify/create')
        .send({
            id: "624ab1431c48d7d8310c552c",
            text: " thích hành trình của bạn",
            recipients: ["623c966102981f76be675a0d"],
            content: "Đà Lạt 3 ngày 2 đêm ",
            image: "https://res.cloudinary.com/huunguyencs/image/upload/v1651214295/nygp51nhqxd9sjxll3u1.jpg",
            url: "/tour/6257732a71077093dd4d617c"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(201);
        _id = res._body.newNotify._id
    });

    it('notifies', async () => {
        const res = await request(app)
        .get('/notify/notifies?limit=5&offset=0')
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('is seen notify', async () => {
        const res = await request(app)
        .patch(`/notify/is_seen_notify/${_id}`)
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('is seen notify not found', async () => {
        const res = await request(app)
        .patch('/notify/is_seen_notify/123456789')
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(500);
    });

    it('mark all read', async () => {
        const res = await request(app)
        .patch('/notify/mark_all_read')
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });
   
    it('mark all read auth', async () => {
        const res = await request(app)
        .patch('/notify/mark_all_read')
        .send()
        .set('Authorization', `Bearer 123456789`);
        
        expect(res.statusCode).toEqual(401);
    });

    it('delete notify', async () => {
        const dataNotify = {
            id: "624ab1431c48d7d8310c552c",
            url: "/tour/6257732a71077093dd4d617c"
        }
        const res = await request(app)
        .delete(`/notify/${dataNotify.id}?url=${dataNotify.url}&type=${dataNotify.type}`)
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });
});


// Report
describe('Report Endpoints', () => {
    var _id = ""
    it('Create Report', async () => {
        const res = await request(app)
        .post('/report/create')
        .send({
            postId: "6257745d71077093dd4d6200",
            content: "abc",
            type: "Bạo lực"
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
        _id = res._body.newReport._id
    });

    it('Get All Report By User', async () => {
        const res = await request(app)
        .get('/report/all')
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(401);
    });

    it('Get All Report By Admin', async () => {
        const res = await request(app)
        .get('/report/all')
        .send()
        .set('Authorization', `Bearer ${admin_access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('Finished Report', async () => {
        const res = await request(app)
        .patch(`/report/${_id}`)
        .send()
        .set('Authorization', `Bearer ${admin_access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('Finished Tour and Delete Post Not Found', async () => {
        const res = await request(app)
        .patch(`/report/delete/${_id}`)
        .send({
            postId: "123456"
        })
        .set('Authorization', `Bearer ${admin_access_token}`);
        
        expect(res.statusCode).toEqual(500);
    });

    it('Finished Tour and Delete Post', async () => {
        const res = await request(app)
        .patch(`/report/delete/${_id}`)
        .send({
            postId: "6257745d71077093dd4d6200"
        })
        .set('Authorization', `Bearer ${admin_access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('Get Report', async () => {
        const res = await request(app)
        .get(`/report/${_id}`)
        .send()
        .set('Authorization', `Bearer ${admin_access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('Delete Report', async () => {
        const res = await request(app)
        .delete(`/report/${_id}`)
        .send()
        .set('Authorization', `Bearer ${admin_access_token}`);
        
        expect(res.statusCode).toEqual(404);
    });
});
    
// Volunteer
describe('Volunteer Endpoints', () => {
    var _id = ""
    it('Create Volunteer', async () => {
        const res = await request(app)
        .post(`/volunteer/create`)
        .send({
          name:"Volunteer Test",
          type:"Giao duc",
          images:["https://res.cloudinary.com/huunguyencs/image/upload/v1651214295/nygp51nhqxd9sjxll3u1.jpg"],
          descriptions:["abc"],
          cost: 2000000,
          date: [],
          location : [],
        })
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
        _id = res._body.newVolunteer._id
    });

    it('Get Volunteers', async () => {
        const res = await request(app)
        .get("/volunteer/volunteers?maxCost=900&minCost=20&q=''")
        .send()
        .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.statusCode).toEqual(200);
    });

    it('Search Volunteers', async () => {
      const res = await request(app)
      .get("/volunteer/search?q='son la'")
      .send()
      .set('Authorization', `Bearer ${access_token}`);
      
      expect(res.statusCode).toEqual(200);
    });

    it('Get 1 Volunteer', async () => {
      const res = await request(app)
      .get(`/volunteer/${_id}`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);
      
      expect(res.statusCode).toEqual(200);
    });

    it('Update Info Volunteer', async () => {
      const res = await request(app)
      .patch(`/volunteer/${_id}`)
      .send({
        name: "abc", 
        images:["",""],
        type:"giáo dục", 
        cost: 200, 
        descriptions: ["abc","abc"],
        date:[],
        location:[]
      })
      .set('Authorization', `Bearer ${access_token}`);
      
      expect(res.statusCode).toEqual(200);
    });

    it('Join  All Volunteer ', async () => {
      const res = await request(app)
      .patch(`/volunteer/${_id}/joinAll`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);
      
      expect(res.statusCode).toEqual(200);
    });

    it('Join  All Volunteer ', async () => {
      const res = await request(app)
      .patch("/volunteer/123456/joinAll")
      .send()
      .set('Authorization', `Bearer ${access_token}`);
      
      expect(res.statusCode).toEqual(404);
    });

    it('UnJoin  All Date Volunteer ', async () => {
      const res = await request(app)
      .patch(`/volunteer/${_id}/unjoinAll`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);
      
      expect(res.statusCode).toEqual(200);
    });

    it('Join 1  Date Volunteer ', async () => {
      const res = await request(app)
      .patch("/volunteer/623056f1460e03488e692045/joinOne")
      .send({
        isAccommodation: true
      })
      .set('Authorization', `Bearer ${access_token}`);
      
      expect(res.statusCode).toEqual(200);
    });

    it('UnJoin 1  Date Volunteer ', async () => {
      const res = await request(app)
      .patch("/volunteer/623056f1460e03488e692045/unjoinOne")
      .send({
        isAccommodation: true
      })
      .set('Authorization', `Bearer ${access_token}`);
      
      expect(res.statusCode).toEqual(200);
    });

    it('Delete 1 Volunteer', async () => {
      const res = await request(app)
      .delete(`/volunteer/${_id}`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);
      
      expect(res.statusCode).toEqual(200);
    });
});
