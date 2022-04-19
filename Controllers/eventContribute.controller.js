const Events = require('../Models/eventContribute.model')
const date = require('../utils/date');
const Provinces = require('../Models/province.model')

class EventContributeController {
    async createEvent(req, res) {
        try {
            const { description, timedes, name, fullname, provinceId, images, time, calendarType } = req.body;
            var newEvent;
            if (provinceId) {
                const prov = Provinces.findById(provinceId).select('fullname');
                if (prov) {
                    const province = prov.fullname;
                    newEvent = new Events({
                        description, timedes, name, fullname, provinceId, images, time, calendarType, province
                    })
                }
                else {
                    res.notFound('Không tìm thấy tỉnh!')
                }
            }
            else {
                newEvent = new Events({
                    description, timedes, name, fullname, images, time, calendarType
                })
            }
            await newEvent.save();

            res.created({
                success: true,
                message: "Create event successful",
                event: {
                    ...newEvent._doc
                }
            })
        }
        catch (err) {
            res.error(err);
        }
    }

    async updateEvent(req, res) {
        try {
            const { description, timedes, name, fullname, provinceId, images, time, calendarType } = req.body;
            const event = await Events.findOneAndUpdate({ _id: req.params.id }, {
                description, timedes, name, fullname, provinceId, images, time, calendarType
            }, { new: true })
                .populate("provinceId", "name fullname image");

            res.success({
                success: true,
                message: "get info 1 event successful",
                event
            })
        } catch (err) {
            res.error(err);
        }
    }

    async getEvent(req, res) {
        try {
            const event = await Events.findOne({ name: req.params.name })
                .populate("provinceId", "name fullname")
            if (event) {
                res.success({
                    success: true,
                    message: "get info 1 event successful",
                    event
                })
            }
            else {
                res.notFound("Không tìm thấy sự kiện")
            }

        }
        catch (err) {
            res.error(err);
        }
    }

    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            await Events.findByIdAndDelete(id)
            res.deleted('Xóa sự kiện thành công')
        }
        catch (err) {
            res.error(err);
        }
    }

    async getCurrentEvent(req, res) {
        try {
            var dateIntLunar = date.lunarToDateInt() % 355;
            var dateIntSolar = date.solarToDateInt() % 365;
            var gteLunar = (dateIntLunar + 351) % 355;
            var gteSolar = (dateIntSolar + 361) % 365;

            const events = await Events.find({
                $or: [
                    { calendarType: false, time: { $gte: gteLunar > 348 ? gteLunar : 365, $lte: 355, $ne: 0 } },
                    { calendarType: true, time: { $gte: gteSolar > 358 ? gteSolar : 366, $lte: 365, $ne: 0 } },
                    { calendarType: false, time: { $gte: gteLunar > 348 ? 0 : gteLunar, $lte: (dateIntLunar + 10) % 355, $ne: 0 } },
                    { calendarType: true, time: { $gte: gteSolar > 358 ? 0 : gteSolar, $lte: (dateIntSolar + 10) % 365, $ne: 0 } },
                ]
            }, "timedes name fullname images provinceId").populate("provinceId", "fullname").sort('time')

            // const events1 = await Events.find({
            //     $or: [
            //         { calendarType: false, time: { $gte: gteLunar > 348 ? gteLunar : 365, $lte: 355, $ne: 0 } },
            //         { calendarType: true, time: { $gte: gteSolar > 358 ? gteSolar : 366, $lte: 365, $ne: 0 } }
            //     ]
            // }, "timedes name fullname images provinceId").populate("provinceId", "fullname").sort('time')


            // const events2 = await Events.find({
            //     $or: [
            //         { calendarType: false, time: { $gte: gteLunar > 348 ? 0 : gteLunar, $lte: (dateIntLunar + 10) % 355, $ne: 0 } },
            //         { calendarType: true, time: { $gte: gteSolar > 358 ? 0 : gteSolar, $lte: (dateIntSolar + 10) % 365, $ne: 0 } },
            //     ]
            // }, "timedes name fullname images provinceId").populate("provinceId", "fullname").sort('time')

            // // console.log(events.length)

            // const events = [
            //     ...events1,
            //     ...events2,
            // ]
            res.success({
                success: true,
                message: 'Thành công',
                events
            })
        }
        catch (err) {
            res.error(err);
        }
    }
    async getAll(req, res) {
        try {
            const events = await Events.find({}).select("name fullname time provinceId calendarType")
                .populate("provinceId", "fullname")
            res.success({
                success: true,
                message: "Lấy tất cả các sự kiện thành công",
                events
            })
        } catch (err) {
            res.error(err);
        }
    }

    async search(req, res) {
        try {
            var { q, offset } = req.query;
            offset = offset || 0;
            var events = await Events.find({ $text: { $search: q } }, { score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } })
                .skip(offset * 10)
                .limit(10);
            events = events.map((item) => ({
                _id: item._id,
                fullname: item.fullname,
                link: `/event/${item.name}`,
                description: 'Thời gian: ' + item.timedes,
                image: item.images[0]
            }))
            res.success({ success: true, results: events, query: q })
        } catch (err) {
            res.error(err)
        }
    }
}

module.exports = new EventContributeController();