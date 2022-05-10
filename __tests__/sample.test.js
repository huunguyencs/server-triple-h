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

  it('Login Email Wrong', async () => {
    const res = await request(app).post('/user/login').send({
      email: 'huunguyen@gmail.com',
      password: 'Vanhuu123'
    });

    expect(res.statusCode).toEqual(400);
  });

  it('Login Password Wrong', async () => {
    const res = await request(app).post('/user/login').send({
      email: 'admin@gmail.com',
      password: 'Vanhuu123'
    });

    expect(res.statusCode).toEqual(400);
  });

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

  it('Change avatar No Auth', async () => {
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

  it('Change Password Fail', async () => {
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

  it('Get User By Id Not Found', async () => {
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
  it('Create Event No Auth', async () => {
    const res = await request(app)
      .post('/event/create')
      .send({
        description: 'test create event',
        timedes: 'Mùng 1 tháng 1',
        name: 'test-event-1',
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
        name: 'test-event-1',
        fullname: 'Tết Nguyên Đán',
        images:
          'https://i.ex-cdn.com/tintucvietnam.vn/files/tuanluc/2022/01/26/lich-nghi-tet-nguyen-dan-2022-cac-ngan-hang-0855.jpg',
        time: 1,
        calendarType: false
      })
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(201);

    _id = res._body.event._id;
  });

  it('Update Event', async () => {
    const res = await request(app)
      .patch(`/event/${_id}`)
      .send({
        description: 'test create event',
        timedes: 'Mùng 1 tháng 2',
        name: 'test-event-1',
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
    const res = await request(app).get('/event/search?q=tet').send();
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

  let _id = '';

  it('Create Help', async () => {
    const res = await request(app)
      .post('/help/')
      .send({
        description: 'abc',
        position: [106.805352462046, 10.87786316048955],
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
        position: [106.805352462046, 10.87786316048955],
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
  let _id = '';
  it('Create Location', async () => {
    const res = await request(app)
      .post('/location/create')
      .send({
        name: 'test-location-1',
        images:
          'https://res.cloudinary.com/dqxvfu5k1/image/upload/v1648394446/mfjkvaqccfqlidgpp0ez.jpg',
        province: '62402c8c1c6f58b4b42fc0eb',
        position: {
          lng: 108,
          lat: 16
        },
        information: 'test',
        fullname: 'Địa điểm test'
      })
      .set('Authorization', `Bearer ${admin_access_token}`);
    expect(res.statusCode).toEqual(201);
    _id = res._body.newLocation._id;
  });

  it('Update Location No Auth', async () => {
    const res = await request(app)
      .patch(`/location/${_id}`)
      .send({
        name: 'test-location-1',
        // position: [112, 12],
        position: {
          lng: 112,
          lat: 12
        },
        information: 'Test Update'
      });

    expect(res.statusCode).toEqual(401);
  });

  it('Update Location', async () => {
    const res = await request(app)
      .patch(`/location/${_id}`)
      .send({
        name: 'test-location-1',
        // position: [112, 12],
        position: {
          lng: 112,
          lat: 12
        },
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
    const res = await request(app).get('/location/search?q=chua').send();

    expect(res.statusCode).toEqual(200);
  });

  it('Get 1 location Not Found', async () => {
    const res = await request(app).get('/location/bien').send();
    expect(res.statusCode).toEqual(404);
  });

  it('Get 1 location', async () => {
    const res = await request(app).get('/location/bien-cua-lo').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Post Location', async () => {
    const res = await request(app)
      .get('/location/62407acebd32c70b9c3f065b/posts')
      .send();
    expect(res.statusCode).toEqual(200);
  });
});

// Message
describe('Message Endpoints', () => {
  it('Create Message', async () => {});
});

// Notify
describe('Notify Endpoints', () => {});

// Post
describe('Post Endpoints', () => {
  it('Get post', async () => {
    const res = await request(app).get('/post/625143e6f527ca13625ebb76').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Post User', async () => {
    const res = await request(app)
      .get('/post/user/623c966102981f76be675a0d')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('Create Post No Auth', async () => {
    const res = await request(app)
      .post('/post/create_post')
      .send({
        content: 'Test Post',
        images:
          'https://phocode.com/wp-content/uploads/2020/10/placeholder-1.png',
        hashtags: ['bien', 'nui']
      });

    expect(res.statusCode).toEqual(401);
  });

  let _id = '';

  it('Create Post', async () => {
    const res = await request(app)
      .post('/post/create_post')
      .send({
        content: 'Test Post',
        images:
          'https://phocode.com/wp-content/uploads/2020/10/placeholder-1.png',
        hashtags: ['bien', 'nui']
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(201);
    _id = res._body.newPost._id;
  });

  it('Create Review', async () => {
    const res = await request(app)
      .post('/post/create_review')
      .send({
        content: 'Test Review',
        images:
          'https://phocode.com/wp-content/uploads/2020/10/placeholder-1.png',
        hashtags: ['cualo'],
        locationId: '62407acebd32c70b9c3f065b',
        rate: 5
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(201);
  });

  it('Share Post', async () => {
    const res = await request(app)
      .post('/post/share')
      .send({
        content: 'Test Share',
        hashtags: ['test'],
        shareId: _id
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(201);
  });

  it('Get Posts', async () => {
    const res = await request(app)
      .get('/post/posts')
      .send()
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Get Post By Id', async () => {
    const res = await request(app).get('/post/625143e6f527ca13625ebb76').send();

    expect(res.statusCode).toEqual(200);
  });

  it('Update Post', async () => {
    const res = await request(app)
      .patch(`/post/${_id}`)
      .send({
        content: 'test',
        hashtags: ['test']
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Like Post', async () => {
    const res = await request(app)
      .patch(`/post/${_id}/like`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Unlike Post', async () => {
    const res = await request(app)
      .patch(`/post/${_id}/unlike`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Delete Post', async () => {
    const res = await request(app)
      .delete(`/post/${_id}`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(204);
  });
});

// Province
describe('Province Endpoints', () => {
  let _id = '';
  it('Create Province No Auth', async () => {
    const res = await request(app)
      .post('/province/create')
      .send({
        name: 'test-province-1',
        fullname: 'Test Province',
        image:
          'https://phocode.com/wp-content/uploads/2020/10/placeholder-1.png',
        position: {
          lat: 108,
          lng: 15
        }
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(401);
  });

  it('Create Province', async () => {
    const res = await request(app)
      .post('/province/create')
      .send({
        name: 'test-province-1',
        fullname: 'Test Province',
        image:
          'https://phocode.com/wp-content/uploads/2020/10/placeholder-1.png',
        position: {
          lat: 108,
          lng: 15
        }
      })
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(201);

    _id = res._body.newProvince._id;
  });

  it('Get All Province', async () => {
    const res = await request(app).get('/province/provinces').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Search Province', async () => {
    const res = await request(app).get('/province/search?q=Quang').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Location in Province', async () => {
    const res = await request(app)
      .get('/province/location/62402c8c1c6f58b4b42fc0eb')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Event in Province', async () => {
    const res = await request(app)
      .get('/province/event/62402c8c1c6f58b4b42fc0eb')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Service in Province', async () => {
    const res = await request(app)
      .get('/province/service/62402c8c1c6f58b4b42fc0eb')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Province', async () => {
    const res = await request(app).get('/province/nghe-an').send();

    expect(res.statusCode).toEqual(200);
  });

  it('Update Province', async () => {
    const res = await request(app)
      .patch(`/province/${_id}`)
      .send({
        name: 'test-province-1',
        fullname: 'Test Update',
        information: 'test'
      })
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(200);
  });
});

// Report
describe('Report Endpoints', () => {});

// Service
describe('Service Endpoints', () => {
  it('Create Service No Auth', async () => {
    const res = await request(app)
      .post('/service/create')
      .send({
        name: 'Test',
        description: 'Test description',
        contact: 'test contact',
        type: 'nha hang',
        province: '62402c8c1c6f58b4b42fc0eb',
        cost: 'test cost'
      })
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(401);
  });

  let id = '';
  it('Create Service', async () => {
    const res = await request(app)
      .post('/service/create')
      .send({
        name: 'Test',
        description: 'Test description',
        contact: 'test contact',
        type: 'nha hang',
        province: '62402c8c1c6f58b4b42fc0eb',
        cost: 'test cost'
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(201);

    id = res._body.service._id;
  });

  it('Get Services', async () => {
    const res = await request(app).get('/service/services').send();

    expect(res.statusCode).toEqual(200);
  });

  it('Get All Services', async () => {
    const res = await request(app).get('/service/all').send();

    expect(res.statusCode).toEqual(200);
  });

  it('Get By Cooperator', async () => {
    const res = await request(app)
      .get(`/service/get_by_coop/62504fd55133ea41f9474cf3`)
      .send();

    expect(res.statusCode).toEqual(200);
  });

  it('Get Service Detail', async () => {
    const res = await request(app)
      .get('/service/get_detail/62577ce871077093dd4d6504')
      .send();

    expect(res.statusCode).toEqual(200);
  });

  it('Search Service', async () => {
    const res = await request(app).get('/service/search?q=Hiep').send();

    expect(res.statusCode).toEqual(200);
  });

  it('Hot Service Near', async () => {
    const res = await request(app).get('/service/top_near').send();

    expect(res.statusCode).toEqual(200);
  });

  it('Review Service', async () => {
    const res = await request(app)
      .post('/service/review/62577ce871077093dd4d6504')
      .send({
        rate: 5,
        content: 'test'
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Get Service By Id', async () => {
    const res = await request(app)
      .get('/service/62577ce871077093dd4d6504')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('Update Service', async () => {
    const res = await request(app).put(`/service/${id}`).send({
      name: 'Test Update',
      description: 'Test description',
      contact: 'test contact',
      type: 'nha hang',
      province: '62402c8c1c6f58b4b42fc0eb',
      cost: 'test cost'
    });
    expect(res.statusCode).toEqual(200);
  });

  it('Delete Service', async () => {
    const res = await request(app).delete(`/service/${id}`).send();
    expect(res.statusCode).toEqual(204);
  });
});

// Tour
describe('Tour Endpoints', () => {
  let id = '';
  it('Create Tour', async () => {
    const res = await request(app)
      .post('/tour/create')
      .send({
        content: 'test',
        name: 'test',
        image:
          'https://res.cloudinary.com/huunguyencs/image/upload/v1648454079/smo2i37u6ufdvig2e9yp.jpg',
        hashtags: ['test'],
        tour: [
          {
            date: new Date(),
            description: 'test',
            services: [],
            cost: 50,
            locations: {
              location: '62407acebd32c70b9c3f065b',
              description: 'hi',
              cost: 0,
              time: '',
              service: []
            }
          }
        ],
        provinces: ['Quảng Ngãi'],
        locations: ['Biển Mỹ Khê'],
        cost: 500
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(201);
    id = res._body.newTour._id;
  });

  it('Share Tour', async () => {
    const res = await request(app)
      .post('/tour/share')
      .send({
        content: 'test',
        hashtags: ['test'],
        shareId: id
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(201);
  });

  it('Tour List', async () => {
    const res = await request(app).get('/tour/tours').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Search Tour', async () => {
    const res = await request(app).get('/tour/search?q=HaNoi').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Search Tour Hot', async () => {
    const res = await request(app).get('/tour/search_hot?q=HaNoi').send();
    expect(res.statusCode).toEqual(200);
  });
  it('Tour Hot', async () => {
    const res = await request(app).get('/tour/hot').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Tour For You', async () => {
    const res = await request(app).get('/tour/hot').send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Tour User', async () => {
    const res = await request(app)
      .get('/tour/user/623c966102981f76be675a0d')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get Tour By Id', async () => {
    const res = await request(app).get(`/tour/${id}`).send();
    expect(res.statusCode).toEqual(200);
  });

  it('Update Tour', async () => {
    const res = await request(app)
      .patch(`/tour/${id}`)
      .send({
        content: 'test',
        name: 'test',
        image:
          'https://res.cloudinary.com/huunguyencs/image/upload/v1648454079/smo2i37u6ufdvig2e9yp.jpg',
        hashtags: ['test'],
        tour: [
          {
            date: new Date(),
            description: 'test',
            services: [],
            cost: 50,
            locations: {
              location: '62407acebd32c70b9c3f065b',
              description: 'hi',
              cost: 0,
              time: '',
              service: []
            }
          }
        ],
        provinces: ['Quảng Ngãi'],
        locations: ['Biển Mỹ Khê'],
        cost: 500
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Like Tour', async () => {
    const res = await request(app)
      .patch(`/tour/${id}/like`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Unlike Tour', async () => {
    const res = await request(app)
      .patch(`/tour/${id}/unlike`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Join Tour', async () => {
    const res = await request(app)
      .patch(`/tour/${id}/join`)
      .send()
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Unjoin Tour', async () => {
    const res = await request(app)
      .patch(`/tour/${id}/unjoin`)
      .send()
      .set('Authorization', `Bearer ${admin_access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Join Loc', async () => {
    const res = await request(app)
      .patch(`/tour/624169bf9a6eb2bfbb65ccd6/join_loc`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Unjoin Loc', async () => {
    const res = await request(app)
      .patch(`/tour/624169bf9a6eb2bfbb65ccd6/unjoin_loc`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Delete Tour', async () => {
    const res = await request(app)
      .delete(`/tour/${id}`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(204);
  });
});

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

  it('Get tour volunteer', async () => {
    const res = await request(app)
      .get('/comment/volunteer/6257795e71077093dd4d63d3')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  let id = '';

  it('Create Comment', async () => {
    const res = await request(app)
      .post('/comment/create')
      .send({
        commentType: 'post',
        content: 'test',
        postId: '625143e6f527ca13625ebb76'
      })
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(201);
    id = res._body.newComment._id;
  });

  it('Update Comment', async () => {
    const res = await request(app)
      .patch(`/comment/${id}`)
      .send({
        content: 'test update'
      })
      .set('Authorization', `Bearer ${access_token}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Like Comment', async () => {
    const res = await request(app)
      .patch(`/comment/${id}/like`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Unlike Comment', async () => {
    const res = await request(app)
      .patch(`/comment/${id}/unlike`)
      .send()
      .set('Authorization', `Bearer ${access_token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Delete Comment', async () => {
    const res = await request(app).delete(`/comment/${id}`).send();
    expect(res.statusCode).toEqual(204);
  });
});
