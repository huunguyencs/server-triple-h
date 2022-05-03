const recombee = require('recombee-api-client');
let rqs = recombee.requests;

const recombeeClient = new recombee.ApiClient(
  process.env.RECOMBEE_DB,
  process.env.RECOMBEE_TOKEN,
  { region: 'ap-se' }
);

function rating(userId, itemId, rating) {
  let i = new rqs.AddRating(userId, itemId, rating, { cascadeCreate: true });
  i.timeout = 10000;
  recombeeClient
    .send(i)
    .then(res => console.log('rating success'))
    .catch(err => console.log('rating fail'));
}

function cartAdd(userId, itemId) {
  let i = new rqs.AddCartAddition(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  recombeeClient
    .send(i)
    .then(res => console.log('cart add success'))
    .catch(err => console.log('cart add fail'));
}

function cartRemove(userId, itemId) {
  let i = new rqs.DeleteCartAddition(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  recombeeClient
    .send(i)
    .then(res => console.log('cart remove success'))
    .catch(err => console.log('cart remove fail'));
}

function viewDetail(userId, itemId) {
  recombeeClient
    .send(new rqs.AddDetailView(userId, itemId, { cascadeCreate: true }))
    .then(res => console.log('view detail success'))
    .catch(err => console.log('view detail fail'));
}

function purchasesItem(userId, itemId) {
  let i = new rqs.AddPurchase(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  recombeeClient
    .send(i)
    .then(res => console.log('purchases success'))
    .catch(err => console.log('purchases fail'));
}

function removePurchases(userId, itemId) {
  let i = new rqs.DeletePurchase(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  recombeeClient
    .send(i)
    .then(res => console.log('rm pur success'))
    .catch(err => console.log('rm pur fail'));
}

function bookmark(userId, itemId) {
  let i = new rqs.AddBookmark(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  recombeeClient
    .send(i)
    .then(res => console.log('bookmark success'))
    .catch(err => console.log('bookmark fail'));
}

function unBookmark(userId, itemId) {
  let i = new rqs.DeleteBookmark(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  recombeeClient
    .send(i)
    .then(res => console.log('ubookmark success'))
    .catch(err => console.log('ubook fail'));
}

async function getRecommend(userId, count, type) {
  let i = new rqs.RecommendItemsToUser(userId, count, {
    filter: 'type' == type,
    cascadeCreate: true,
    minRelevance: 'low'
  });
  i.timeout = 10000;
  const res = await recombeeClient.send(i);
  return res;
}

async function getSimilarItem(itemId, count, type) {
  let i = new rqs.RecommendItemsToItem(itemId, count, {
    filter: 'type' == type,
    cascadeCreate: true,
    minRelevance: 'low'
  });
  i.timeout = 10000;
  const res = await recombeeClient.send(i);
  return res;
}

async function getUserRecommend(userId, count) {
  let i = new rqs.RecommendUsersToUser(userId, count, {
    cascadeCreate: true,
    minRelevance: 'low'
  });
  i.timeout = 10000;
  const res = await recombeeClient.send(i);
  return res;
}

function createItem(id, type, categories, description) {
  let item = [];
  item.push(new rqs.AddItem(id));
  let value = { type: type };
  if (categories) value.categories = categories;
  if (description) value.description = description;
  item.push(new rqs.SetItemValues(id, value));
  recombeeClient
    .send(new rqs.Batch(item))
    .then(res => {
      console.log(`Create ${type} ${id} successful`);
    })
    .catch(err => {
      console.log(err);
      console.log(`Create ${type} ${id} fail`);
    });
}

function deleteItem(id) {
  recombeeClient.send(rqs.DeleteItem(id));
}

function createUser(id) {
  const item = new rqs.AddUser(id);
  recombeeClient
    .send(item)
    .then(res => {
      console.log(`Create ${id} successful`);
    })
    .catch(err => {
      console.log(`Create ${id} fail`);
    });
}

function setPrefUser(id, pref) {
  const task = new rqs.SetUserValues(id, { pref: new Set(pref) });
  recombeeClient
    .send(task)
    .then(() => {
      console.log('set pref user successful');
    })
    .catch(() => {
      console.log('set pref user fail');
    });
}

function likeItem(userId, itemId) {
  cartAdd(userId, itemId);
}

function unLikeItem(userId, itemId) {
  cartRemove(userId, itemId);
}

function commentItem(userId, itemId) {
  cartAdd(userId, itemId);
}

function shareItem(userId, itemId) {
  bookmark(userId, itemId);
}

function viewDetailItem(userId, itemId) {
  viewDetail(userId, itemId);
}

function joinItem(userId, itemId) {
  purchasesItem(userId, itemId);
}

function unJoinItem(userId, itemId) {
  removePurchases(userId, itemId);
}

function visitLocation(userId, itemId) {
  purchasesItem(userId, itemId);
}

function useService(userId, itemId) {
  purchasesItem(userId, itemId);
}

function saveItem(userId, itemId) {
  bookmark(userId, itemId);
}

function unSaveItem(userId, itemId) {
  unBookmark(userId, itemId);
}

function reviewItem(userId, itemId, rate) {
  rating(userId, itemId, rate);
}

async function getPostRecommend(userId, count = 10) {
  const res = await getRecommend(userId, count, 'post');
  return res;
}

async function getTourRecommend(userId, count = 10) {
  const res = await getRecommend(userId, count, 'tour');
  return res;
}

async function getLocationRecommend(userId, count = 10) {
  const res = await getRecommend(userId, count, 'location');
  return res;
}

async function getVolunteerRecommend(userId, count = 10) {
  const res = await getRecommend(userId, count, 'volunteer');
  return res;
}

async function getServiceRecommend(userId, count = 10) {
  const res = await getRecommend(userId, count, 'service');
  return res;
}

async function getFollowRecommend(userId, count = 10) {
  const res = await getUserRecommend(userId, count);
  return res;
}

async function getSimilarTour(tourId, count = 3) {
  const res = await getSimilarItem(tourId, count, 'tour');
  return res;
}

module.exports = {
  createItem,
  deleteItem,
  createUser,
  likeItem,
  unLikeItem,
  commentItem,
  shareItem,
  viewDetailItem,
  joinItem,
  unJoinItem,
  visitLocation,
  useService,
  saveItem,
  unSaveItem,
  reviewItem,
  getPostRecommend,
  getTourRecommend,
  getLocationRecommend,
  getVolunteerRecommend,
  getServiceRecommend,
  getFollowRecommend,
  getSimilarTour,
  setPrefUser
};
