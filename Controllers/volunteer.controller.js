const Volunteers = require('../Models/volunteer.model')
const VolunteerDates = require('../Models/volunteerDate.model')
const VolunteerLocations = require('../Models/volunteerLocation.model')
const Comments = require('../Models/comment.model')
const { createItem, joinItem, unJoinItem, viewDetailItem } = require('../utils/recombee')

const ObjectId = require('mongoose').Types.ObjectId;
class VolunteerController {
    async createVolunteer(req, res) {
        try {
            const { name, images, cost, type, descriptions, date, location } = req.body

            const newVolunteer = new Volunteers({
                userId: req.user._id, name, type, images, descriptions, cost, date: [], location: [], users: []
            })

            await newVolunteer.save()

            if (date.length > 0) {
                date.forEach(async function (element) {
                    const newVolunteerDate = new VolunteerDates({
                        activities: element.activities, accommodation: element.accommodation, date: element.date
                    })
                    await newVolunteerDate.save();
                    await Volunteers.findOneAndUpdate({ _id: newVolunteer._id }, {
                        $push: {
                            date: newVolunteerDate._id
                        }
                    });
                });
            }

            if (location.length > 0) {
                location.forEach(async function (element) {
                    const newVolunteerLocation = new VolunteerLocations({
                        users: [], timeStart: element.timeStart, maxUsers: element.maxUsers, description: element.description,
                        activities: element.activities,
                        ageUser: element.ageUser, location: element.location
                    })
                    await newVolunteerLocation.save();
                    await Volunteers.findOneAndUpdate({ _id: newVolunteer._id }, {
                        $push: {
                            location: newVolunteerLocation._id
                        }
                    });
                });
            }
            res.success({
                success: true,
                message: "Create Volunteer successful",
                newVolunteer: {
                    ...newVolunteer._doc,
                    userId: {
                        fullname: req.user.fullname,
                        _id: req.user._id,
                        avatar: req.user.avatar,
                        followers: req.user.followers
                    }
                }
            })

            createItem(newVolunteer._doc._id, 'volunteer', [type], descriptions[0])
        } catch (err) {
            console.log(err)
            res.error(err);
        }
    }

    async updateVolunteer(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy hoạt động');
                return;
            }
            const { name, images, type, cost, descriptions, date, location } = req.body;

            const newVolunteer = await Volunteers.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, {
                name, images, type, cost, descriptions
            }, { new: true })
                .populate("userId", "username fullname avatar")
                .populate("date", "accommodation date activities")
                .populate({
                    path: "location",
                    populate: {
                        path: "location",
                        select: "fullname position"
                    }
                })

            if (newVolunteer) {
                // console.log("date",date[1].activities);
                // console.log("location", location)
                const oldVolunteerDate = newVolunteer.date.map(item => item._id);
                const oldVolunteerLocation = newVolunteer.location.map(item => item._id);
                // console.log("oldVolunteerDate",oldVolunteerDate);
                // console.log("oldVolunteerLocation",oldVolunteerLocation);

                let dateId = []
                date.forEach((item) => {
                    if (item._id) dateId.push(item._id.toString())
                })
                oldVolunteerDate.forEach(async function (element) {
                    if (!dateId.includes(element.toString())) {
                        await Volunteers.findByIdAndUpdate(req.params.id, {
                            $pull: {
                                date: element._id
                            }
                        });
                        await VolunteerDates.findOneAndDelete({ _id: element._id });
                    }
                })
                date.forEach(async function (element) {
                    if (element._id)
                        await VolunteerDates.findByIdAndUpdate(element._id, {
                            activities: element.activities, accommodation: element.accommodation, date: element.date
                        }, { new: true })
                    else {
                        let newVolunteerDate = new VolunteerDates({
                            activities: element.activities, accommodation: element.accommodation, date: element.date
                        })
                        await newVolunteerDate.save();
                        await Volunteers.findByIdAndUpdate(req.params.id, {
                            $push: {
                                date: newVolunteerDate._id
                            }
                        });
                    }
                })

                let locationId = []
                location.forEach((item) => {
                    if (item._id) locationId.push(item._id.toString())
                })
                oldVolunteerLocation.forEach(async function (element) {
                    if (!locationId.includes(element.toString())) {
                        await Volunteers.findByIdAndUpdate(req.params.id, {
                            $pull: {
                                location: element._id
                            }
                        });
                        await VolunteerLocations.findOneAndDelete({ _id: element._id });
                    }
                })
                location.forEach(async function (element) {
                    if (element._id)
                        await VolunteerLocations.findByIdAndUpdate(element._id, {
                            users: [], timeStart: element.timeStart, maxUsers: element.maxUsers, description: element.description,
                            activities: element.activities,
                            ageUser: element.ageUser, images: element.images, location: element.location
                        }, { new: true })
                    else {
                        let newVolunteerLocation = new VolunteerLocations({
                            users: [], timeStart: element.timeStart, maxUsers: element.maxUsers, description: element.description,
                            activities: element.activities,
                            ageUser: element.ageUser, images: element.images, location: element.location
                        })
                        await newVolunteerLocation.save();
                        await Volunteers.findByIdAndUpdate(req.params.id, {
                            $push: {
                                location: newVolunteerLocation._id
                            }
                        });
                    }
                })

                res.success({ success: true, message: "update tour successful", newVolunteer })
            }
            else {
                res.status(404).json({ success: false, message: "Không tìm thấy tour" })
            }

        } catch (err) {
            console.log(err)
            res.error(err);
        }
    }


    async getVolunteers(req, res) {
        try {
            const volunteers = await Volunteers.find({}).sort("-createdAt")
                .populate("userId", "username fullname avatar")
                .populate("date", "accommodation date activities")
                .populate({
                    path: "location",
                    populate: {
                        path: "location",
                        select: "fullname position",
                    }
                })
                .populate({
                    path: "location",
                    populate: {
                        path: "users",
                        populate: {
                            path: "user",
                            select: "_id fullname avatar"
                        },
                    }
                })
                .populate("users", "avatar fullname _id")
                .populate({
                    path: "comments",
                    populate: {
                        path: "userId likes",
                        select: "fullname avatar"
                    },
                })

            res.success({ success: true, message: "get volunteers successful", volunteers })
        }
        catch (err) {
            console.log(err);
            res.error(err);;
        }
    }



    // lấy thông tin 1 volunteer theo params.id
    async getVolunteer(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy hoạt động');
                return;
            }
            // console.log(req.params.id)
            let volunteer = await Volunteers.findById(req.params.id);

            if (!volunteer) {
                res.notFound('Không tìm thấy hoạt động tình nguyện')
                return;
            }

            volunteer = await Volunteers.findById(req.params.id)
                .populate("userId", "username fullname avatar")
                .populate("date", "accommodation date activities")
                .populate({
                    path: "location",
                    populate: {
                        path: "location",
                        select: "fullname position"
                    }
                })
                .populate({
                    path: "location",
                    populate: {
                        path: "users",
                        populate: {
                            path: "user",
                            select: "_id fullname avatar"
                        },
                    }
                })
                .populate("users", "avatar fullname _id")
                .populate({
                    path: "comments",
                    populate: {
                        path: "userId likes",
                        select: "fullname avatar"
                    },
                })


            res.success({
                success: true, message: "get info 1 volunteer success", volunteer
            });

            if (req.user && req.user._id !== 0) {
                viewDetailItem(req.user._id, req.params.id)
            }

        } catch (err) {
            console.log(err)
            res.error(err);
        }
    }

    async deleteVolunteer(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy hoạt động');
                return;
            }
            const volunteer = await Volunteers.findById(req.params.id);
            if (volunteer) {
                await Volunteers.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
                if (volunteer.comments) await Comments.deleteMany({ _id: { $in: volunteer.comments } });
                if (volunteer.date) await VolunteerDates.deleteMany({ _id: { $in: volunteer.date } });
                if (volunteer.location) await VolunteerLocations.deleteMany({ _id: { $in: volunteer.location } });
            }
            else {
                res.status(404).json({ success: false, message: "Không tìm thấy Volunteer" })
            }

            res.success({
                success: true, message: "Delete volunteer success"
            });
        } catch (err) {
            console.log(err)
            res.error(err);
        }
    }
    //Tham gia hết volunteer, params.id là id của volunteer
    async joinVolunteerAll(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy hoạt động');
                return;
            }
            var volunteer = await Volunteers.find({ _id: req.params.id, users: req.user._id });
            if (volunteer.length > 0) {
                return res.status(400).json({ success: false, message: "Bạn đã tham gia hoạt động này!" })
            }
            volunteer = await Volunteers.findOneAndUpdate({ _id: req.params.id }, {
                $addToSet: {
                    users: req.user._id
                }
            }, { new: true }).populate("users", "avatar fullname username")
            res.success({
                success: true, message: "join volunteer success",
                users: volunteer.users
            });

            joinItem(req.user._id, req.params.id)
        } catch (err) {
            res.error(err);
        }
    }
    async unJoinVolunteerAll(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy hoạt động');
                return;
            }
            const volunteer = await Volunteers.findByIdAndUpdate(req.params.id, {
                $pull: {
                    users: req.user._id
                }
            }, { new: true }).populate("users", "avatar fullname username")

            res.success({
                success: true, message: "unjoin volunteer success",
                users: volunteer.users
            });
            unJoinItem(req.user._id, req.params.id)
        } catch (err) {
            res.error(err);
        }
    }
    //Tham gia từng địa điểm, params.id là id của volunteerLocation
    async joinVolunteerOne(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy hoạt động');
                return;
            }
            const { isAccommodation } = req.body;

            var volunteerLocation = await VolunteerLocations.find({ _id: req.params.id });
            // console.log("volunteerLocation",volunteerLocation);
            if (volunteerLocation.length > 0) {
                volunteerLocation[0].users.length > 0 && volunteerLocation[0].users.forEach(element => {
                    if (element.user === req.user._id)
                        return res.status(400).json({ success: false, message: "Bạn đã tham gia địa điểm này!" })
                });
            }
            volunteerLocation = await VolunteerLocations.findOneAndUpdate({ _id: req.params.id }, {
                $addToSet: {
                    users: { isAccommodation: isAccommodation, user: req.user._id }
                }
            }, { new: true }).populate({
                path: "users",
                populate: {
                    path: "user",
                    select: "_id fullname avatar"
                },
            })
            res.success({
                success: true, message: "join volunteer success",
                users: volunteerLocation.users
            });
        } catch (err) {
            res.error(err);
        }
    }
    async unJoinVolunteerOne(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy hoạt động');
                return;
            }
            const { isAccommodation } = req.body;
            const volunteerLocation = await VolunteerLocations.findByIdAndUpdate(req.params.id, {
                $pull: {
                    users: { isAccommodation: isAccommodation, user: req.user._id }
                }
            }, { new: true }).populate({
                path: "users",
                populate: {
                    path: "user",
                    select: "_id fullname avatar"
                },
            })

            res.success({
                success: true, message: "unjoin volunteer success",
                users: volunteerLocation.users
            });
        } catch (err) {
            res.error(err);
        }
    }
    async search(req, res) {
        try {
            var { q, offset } = req.query;
            offset = offset || 0;
            var volunteers = await Volunteers.find({ $text: { $search: q } }, { score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } })
                .skip(offset * 10)
                .limit(10)
            volunteers = volunteers.map((item) => ({
                _id: item._id,
                fullname: item.name,
                link: `/volunteer/${item._id}`,
                description: item.descriptions[0],
                image: item.image
            }))
            res.success({ success: true, results: volunteers, query: q })
        } catch (err) {
            res.error(err);
        }
    }


}

module.exports = new VolunteerController;