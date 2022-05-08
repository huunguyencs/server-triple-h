const request = require('supertest');
const app = require('../index.js');

let access_token = '';
let admin_access_token = '';

// User
describe('User Endpoints', () => {
  // it('Register', async () => {
  //   const res = await request(app).post('/user/register').send({
  //     fullname: 'Nguyen Van Huu',
  //     username: 'huunguyen123',
  //     email: 'thieuvan0405@gmail.com',
  //     phone: '0387139936',
  //     password: 'Vanhuu0405'
  //   });
  //   expect(res.statusCode).toEqual(201);
  // });

  let refresh_token = '';

  it('Login', async () => {
    const res = await request(app).post('/user/login').send({
      email: 'nguyenvanhuucse@gmail.com',
      password: 'Vanhuu123'
    });

    expect(res.statusCode).toEqual(200);

    refresh_token = res._body.refreshToken;
    access_token = res._body.accessToken;
  });

  it('Refresh token', async () => {
    const res = await request(app).post('/user/refresh_token').send({
      refresh_token
    });

    expect(res.statusCode).toEqual(200);
  });

  it('Change avatar', async () => {
    const res = await request(app).patch('/user/change_avatar').send({
      avatar: 'https://emblemsbf.com/img/77111.webp'
    });

    expect(res.statusCode).toEqual(401);
  });

  it('Change avatar', async () => {
    const res = await request(app)
      .patch('/user/change_avatar')
      .send({
        avatar: 'https://emblemsbf.com/img/77111.webp'
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Change background', async () => {
    const res = await request(app)
      .patch('/user/change_background')
      .send({
        avatar: 'https://cdn.wallpapersafari.com/39/72/MF1esV.jpg'
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Edit Profile', async () => {
    const res = await request(app)
      .patch('/user/change_info')
      .send({
        username: 'huuabc123',
        fullname: 'Hữu Nguyễn',
        phone: '0123986545',
        birthday: new Date('04/06/2000'),
        gender: 'male',
        andress: 'Ký túc xá khu A',
        hobbies: 'Bóng đá, Biển'
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Change Password', async () => {
    const res = await request(app)
      .patch('/user/change_password')
      .send({
        oldPassword: '123456',
        newPassword: 'Vanhuu0405'
      })
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(400);
  });

  it('Change Password', async () => {
    const res = await request(app)
      .patch('/user/change_password')
      .send({
        oldPassword: 'Vanhuu123',
        newPassword: 'Vanhuu0405'
      })
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Get all user', async () => {
    const res = await request(app)
      .get('/user/all')
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(401);
  });

  it('Admin Login', async () => {
    const res = await request(app).post('/user/login').send({
      email: 'admin@gmail.com',
      password: 'Admin123456'
    });

    expect(res.statusCode).toEqual(200);

    admin_access_token = res._body.accessToken;
  });

  it('Get all user', async () => {
    const res = await request(app)
      .get('/user/all')
      .send()
      .set('Authorization', `Bearer ${admin_access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Search user', async () => {
    const res = await request(app).get('/user/search?q=huu').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Search By Name', async () => {
    const res = await request(app)
      .get('/user/search_by_name?fullname=huu')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Tour Saved', async () => {
    const res = await request(app)
      .get('/user/get_tour_saved')
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Get User By Id', async () => {
    const res = await request(app).get('/user/623c966102981f76be675a0r').send();
    expect(res.statusCode).toEqual(404);
  });

  it('Get User By Id', async () => {
    const res = await request(app).get('/user/623c966102981f76be675a0d').send();
    expect(res.statusCode).toEqual(200);
  });

  it('UnFollow User', async () => {
    const res = await request(app)
      .put('/user/623c966102981f76be675a0d/unfollow')
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Follow User', async () => {
    const res = await request(app)
      .put('/user/623c966102981f76be675a0d/follow')
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });
});

// Event
describe('Event Endpoints', () => {
  it('Create Event', async () => {
    const res = await request(app)
      .post('/event/create')
      .send({
        description: 'test create event',
        timedes: 'Mùng 1 tháng 1',
        name: 'tet-nguyen-dan-holishit',
        fullname: 'Tết Nguyên Đán',
        images:
          'https://i.ex-cdn.com/tintucvietnam.vn/files/tuanluc/2022/01/26/lich-nghi-tet-nguyen-dan-2022-cac-ngan-hang-0855.jpg',
        time: 1,
        calendarType: false
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(401);
  });

  const _id = '';

  it('Create Event', async () => {
    const res = await request(app)
      .post('/event/create')
      .send({
        description: 'test create event',
        timedes: 'Mùng 1 tháng 1',
        name: 'tet-nguyen-dan-holishit',
        fullname: 'Tết Nguyên Đán',
        images:
          'https://i.ex-cdn.com/tintucvietnam.vn/files/tuanluc/2022/01/26/lich-nghi-tet-nguyen-dan-2022-cac-ngan-hang-0855.jpg',
        time: 1,
        calendarType: false
      })
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(200);

    _id = res._body.event._id;
  });

  it('Update Event', async () => {
    const res = await request(app)
      .patch(`/event/${_id}`)
      .send({
        description: 'test create event',
        timedes: 'Mùng 1 tháng 2',
        name: 'tet-nguyen-dan-holishit',
        fullname: 'Tết Nguyên Đán',
        images:
          'https://i.ex-cdn.com/tintucvietnam.vn/files/tuanluc/2022/01/26/lich-nghi-tet-nguyen-dan-2022-cac-ngan-hang-0855.jpg',
        time: 1,
        calendarType: true
      })
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Delete Event', async () => {
    const res = await request(app)
      .delete(`/event/${_id}`)
      .send()
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(204);
  });

  it('Get All Event', async () => {
    const res = await request(app)
      .get('/event/all')
      .send()
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Search Event', async () => {
    const res = await request(app).get('/event/search?q=Tết').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Current Event', async () => {
    const res = await request(app).get('/event/current').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Event By Name', async () => {
    const res = await request(app)
      .get('/event/le-hoi-quynh-son-bac-son-lang-son')
      .send();
    expect(res.statusCode).toEqual(200);
  });
});

// Help
describe('Help Endpoints', () => {
  it('Get Help', async () => {
    const res = await request(app)
      .get('/help?lat=10.87786316048955&lng=106.805352462046')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('My Help', async () => {
    const res = await request(app)
      .get('/help/my')
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  const _id = '';

  it('Create Help', async () => {
    const res = await request(app)
      .post('/help')
      .send({
        description: 'abc',
        position: [10.87786316048955, 106.805352462046],
        type: 'abc',
        positionStr: 'abc',
        contact: 'abc'
      })
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(201);

    _id = res._body.help._id;
  });

  it('Update Help', async () => {
    const res = await request(app)
      .put(`/help/${_id}`)
      .send({
        description: 'xyz',
        position: [10.87786316048955, 106.805352462046],
        type: 'xyz',
        positionStr: 'xyz'
      })
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Get Help By Id', async () => {
    const res = await request(app)
      .get(`/help/${_id}`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Help', async () => {
    const res = await request(app)
      .patch(`/help/help/${_id}`)
      .send()
      .set('Authorization', `Bearer ${admin_access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Delete Help', async () => {
    const res = await request(app)
      .delete(`/help/${_id}`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(204);
  });
});

// Location
describe('Location Endpoints', () => {
  const _id = '';
  it('Create Location', async () => {
    const res = await request(app)
      .post('/location/create')
      .send({
        name: 'diadiemtest',
        images:
          'https://res.cloudinary.com/dqxvfu5k1/image/upload/v1648394446/mfjkvaqccfqlidgpp0ez.jpg',
        province: '62402c8c1c6f58b4b42fc0eb',
        position: [108, 16],
        information: 'test',
        fullname: 'Địa điểm test'
      })
      .set('Authorization', `Bearer ${admin_access_token}`);
    expect(res.statusCode).toEqual(201);
    _id = res._body._id;
  });

  it('Update Location', async () => {
    const res = await request(app)
      .patch(`/location/${_id}`)
      .send({
        name: 'diadiemtest',
        position: [112, 12],
        information: 'Test Update'
      });

    expect(res.statusCode).toEqual(401);
  });

  it('Update Location', async () => {
    const res = await request(app)
      .patch(`/location/${_id}`)
      .send({
        name: 'diadiemtest',
        position: [112, 12],
        information: 'Test Update'
      })
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Delete Location', async () => {
    const res = await request(app)
      .delete(`/location/${_id}`)
      .send()
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(204);
  });

  it('Location at Province', async () => {
    const res = await request(app)
      .get('/location/locations/62402c8c1c6f58b4b42fc0eb')
      .send();

    expect(res.statusCode).toEqual(200);
  });

  it('All Location', async () => {
    const res = await request(app).get('/location/all').send();

    expect(res.statusCode).toEqual(200);
  });

  it('Location Hot', async () => {
    const res = await request(app).get('/location/hot').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Search location', async () => {
    const res = await request(app).get('/location/search?q=Chùa').send();

    expect(res.statusCode).toEqual(200);
  });

  it('Get 1 location', async () => {
    const res = await request(app).get('/location/bien-cua-lo').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Post Location', async () => {
    const res = await request(app).get('/location/bien-cua-lo/posts').send();
    expect(res.statusCode).toEqual(200);
  });
});

// Message
describe('Message Endpoints', () => {});

// Notify
describe('Notify Endpoints', () => {});

// Post
describe('Post Endpoints', () => {
  it('Get post', async () => {
    const res = await request(app).get('/post/625143e6f527ca13625ebb76').send();
    expect(res.statusCode).toEqual(200);
  });
});

// Province
describe('Province Endpoints', () => {});

// Report
describe('Report Endpoints', () => {});

// Service
describe('Service Endpoints', () => {});

// Tour
describe('Tour Endpoints', () => {});

// Volunteer
describe('Volunteer Endpoints', () => {});

// Comment
describe('Comment Endpoints', () => {
  it('Get post comment', async () => {
    const res = await request(app)
      .get('/comment/post/625143e6f527ca13625ebb76')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get tour comment', async () => {
    const res = await request(app)
      .get('/comment/tour/624169bf9a6eb2bfbb65ccd4')
      .send();
    expect(res.statusCode).toEqual(200);
  });
});
