const recombee = require('recombee-api-client');
let rqs = recombee.requests;

const recombeeClient = new recombee.ApiClient(
  process.env.RECOMBEE_DB,
  process.env.RECOMBEE_TOKEN
);

const RATE_MAP = {
  1: -1,
  2: -0.5,
  3: 0,
  4: 0.5,
  5: 1
};

function rating(userId, itemId, rating) {
  const rate = RATE_MAP[rating] || 0;
  let i = new rqs.AddRating(userId, itemId, rate, { cascadeCreate: true });
  i.timeout = 10000;
  return recombeeClient
    .send(i)
    .then(res => console.log('rating success'))
    .catch(err => {
      console.log(err);
      console.log('rating fail');
    });
}

function cartAdd(userId, itemId) {
  let i = new rqs.AddCartAddition(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  return recombeeClient
    .send(i)
    .then(res => console.log('cart add success'))
    .catch(err => {
      console.log(err);
      console.log('cart add fail');
    });
}

function cartRemove(userId, itemId) {
  let i = new rqs.DeleteCartAddition(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  return recombeeClient
    .send(i)
    .then(res => console.log('cart remove success'))
    .catch(err => {
      console.log('cart remove fail');
      console.log(err);
    });
}

function viewDetail(userId, itemId) {
  let i = new rqs.AddDetailView(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  return recombeeClient
    .send(i)
    .then(res => console.log('view detail success'))
    .catch(err => {
      console.log('view detail fail');
      console.log(err);
    });
}

function purchasesItem(userId, itemId) {
  let i = new rqs.AddPurchase(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  return recombeeClient
    .send(i)
    .then(res => console.log('purchases success'))
    .catch(err => {
      console.log('purchases fail');
      console.log(err);
    });
}

function removePurchases(userId, itemId) {
  let i = new rqs.DeletePurchase(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  return recombeeClient
    .send(i)
    .then(res => console.log('rm pur success'))
    .catch(err => console.log('rm pur fail'));
}

function bookmark(userId, itemId) {
  let i = new rqs.AddBookmark(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  return recombeeClient
    .send(i)
    .then(res => console.log('bookmark success'))
    .catch(err => {
      console.log('bookmark fail');
      console.log(err);
    });
}

function unBookmark(userId, itemId) {
  let i = new rqs.DeleteBookmark(userId, itemId, { cascadeCreate: true });
  i.timeout = 10000;
  return recombeeClient
    .send(i)
    .then(res => console.log('ubookmark success'))
    .catch(err => {
      console.log('ubook fail');
      console.log(err);
    });
}

async function getRecommend(userId, count, type) {
  let i = new rqs.RecommendItemsToUser(userId, count, {
    filter: `'type' == "${type}"`,
    cascadeCreate: true,
    minRelevance: 'low'
  });
  i.timeout = 10000;
  return await recombeeClient.send(i);
}

async function getSimilarItem(itemId, userId, count, type) {
  let i = new rqs.RecommendItemsToItem(itemId, userId, count, {
    filter: `'type' == "${type}"`,
    cascadeCreate: true,
    minRelevance: 'low'
  });
  i.timeout = 10000;
  return recombeeClient.send(i).catch(err => {
    console.log(err);
  });
}

async function getUserRecommend(userId, count) {
  let i = new rqs.RecommendUsersToUser(userId, count, {
    cascadeCreate: true,
    minRelevance: 'low'
  });
  i.timeout = 10000;
  return recombeeClient.send(i).catch(err => {
    console.log(err);
  });
}

function createItem(id, type, categories, description) {
  let item = [];
  item.push(new rqs.AddItem(id));
  let value = { type: type };
  if (categories) value.categories = categories;
  if (description) value.description = description;
  item.push(new rqs.SetItemValues(id, value));
  return recombeeClient
    .send(new rqs.Batch(item))
    .then(res => {
      console.log(`Create ${type} ${id} successful`);
    })
    .catch(err => {
      console.log(err);
      console.log(`Create ${type} ${id} fail`);
    });
}

function updatePropsItem(id, type, categories, description) {
  let value = { type: type };
  if (categories) value.categories = categories;
  if (description) value.description = description;
  const task = new rqs.SetItemValues(id, value);
  return recombeeClient
    .send(task)
    .then(() => {
      console.log('Set item value successful');
    })
    .catch(() => {
      console.log('Set item value fail');
    });
}

function deleteItem(id) {
  return recombeeClient.send(rqs.DeleteItem(id));
}

function createUser(id) {
  const item = new rqs.AddUser(id);
  return recombeeClient
    .send(item)
    .then(res => {
      console.log(`Create user ${id} successful`);
    })
    .catch(err => {
      console.log(`Create user ${id} fail`);
    });
}

function setPrefUser(id, pref) {
  const task = new rqs.SetUserValues(id, { pref: JSON.stringify(pref) });
  return recombeeClient
    .send(task)
    .then(() => {
      console.log('Set pref user successful');
    })
    .catch(err => {
      console.log(err);
      console.log('Set pref user fail');
    });
}

function likeItem(userId, itemId) {
  return cartAdd(userId, itemId);
}

function unLikeItem(userId, itemId) {
  return cartRemove(userId, itemId);
}

function commentItem(userId, itemId) {
  return cartAdd(userId, itemId);
}

function shareItem(userId, itemId) {
  return bookmark(userId, itemId);
}

function viewDetailItem(userId, itemId) {
  return viewDetail(userId, itemId);
}

function joinItem(userId, itemId) {
  return purchasesItem(userId, itemId);
}

function unJoinItem(userId, itemId) {
  return removePurchases(userId, itemId);
}

function visitLocation(userId, itemId) {
  return purchasesItem(userId, itemId);
}

function useService(userId, itemId) {
  return purchasesItem(userId, itemId);
}

function saveItem(userId, itemId) {
  return bookmark(userId, itemId);
}

function unSaveItem(userId, itemId) {
  return unBookmark(userId, itemId);
}

function reviewItem(userId, itemId, rate) {
  return rating(userId, itemId, rate);
}

async function getPostRecommend(userId, count = 10) {
  return await getRecommend(userId, count, 'post');
}

async function getTourRecommend(userId, count = 10) {
  return await getRecommend(userId, count, 'tour');
}

async function getLocationRecommend(userId, count = 10) {
  return await getRecommend(userId, count, 'location');
}

async function getVolunteerRecommend(userId, count = 10) {
  return await getRecommend(userId, count, 'volunteer');
}

async function getServiceRecommend(userId, count = 10) {
  return await getRecommend(userId, count, 'service');
}

async function getFollowRecommend(userId, count = 10) {
  return await getUserRecommend(userId, count);
}

async function getSimilarTour(tourId, userId, count = 3) {
  return await getSimilarItem(tourId, userId, count, 'tour');
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
  setPrefUser,
  updatePropsItem
};
