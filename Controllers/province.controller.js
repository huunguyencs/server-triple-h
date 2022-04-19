const Provinces = require('../Models/province.model');
const Locations = require('../Models/location.model');
const Services = require('../Models/service.model');
const Events = require('../Models/event.model');

const ObjectId = require('mongoose').Types.ObjectId;

class ProvinceController {
    async createProvince(req, res) {
        try {
            const { name, fullname, information, image, detail, position } = req.body

            const newProvince = new Provinces({
                image, name, information, detail, fullname, position
            })
            await newProvince.save()

            res.created({
                success: true,
                message: "Create province successful",
                newProvince: {
                    ...newProvince._doc,
                }
            })
        } catch (err) {
            console.log(err)
            res.error(err);
        }
    }

    async updateProvince(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy tỉnh');
                return;
            }
            const { name, fullname, information, detail, image, position } = req.body;

            const province = await Provinces.findByIdAndUpdate(req.params.id, {
                name, fullname, information, detail, image, position
            }, { new: true })

            res.success({ success: true, message: "update province successful", province })
        } catch (err) {
            console.log(err)
            res.error(err);
        }
    }

    // async deleteProvince(req, res) {
    //     try {
    //         await Provinces.findByIdAndDelete(req.params.id);

    //         res.deleted('Xóa tỉnh thành công');
    //     } catch (err) {
    //         console.log(err)
    //         res.error(err);
    //     }
    // }

    // lấy thông tin 1 Province theo params.id
    async getProvince(req, res) {
        try {
            // if (!ObjectId.isValid(req.params.id)) {
            //     res.notFound('Không tìm thấy tỉnh');
            //     return;
            // }
            const id = req.params.id;
            var province = await Provinces.findOne({ name: id });
            if (province) {
                res.success({
                    success: true, message: "get info 1 province success", province
                });
            }
            else {
                res.notFound("Không tìm thấy tỉnh!");
            }


        } catch (err) {
            console.log(err)
            res.error(err);
        }
    }

    async getLocationsProvince(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy tỉnh');
                return;
            }
            const locations = await Locations.find({ province: req.params.id });
            res.success({
                success: true,
                message: "Success",
                locations
            })
        }
        catch (err) {
            res.error(err);
        }
    }

    async getEventsProvince(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy tỉnh');
                return;
            }
            const events = await Events.find({ provinceId: req.params.id });
            res.success({
                success: true,
                message: "Success",
                events
            })
        }
        catch (err) {
            res.error(err);
        }
    }

    async getServicesProvince(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.notFound('Không tìm thấy tỉnh');
                return;
            }
            const services = await Services.find({ province: req.params.id });
            res.success({
                success: true,
                message: "Success",
                services
            })
        }
        catch (err) {
            res.error(err);
        }
    }

    //Get all province
    async getProvinces(req, res) {
        try {
            const provinces = await Provinces.find({}, "fullname name position");
            res.success({ success: true, message: "get all provinces success", provinces });
        } catch (err) {
            console.log(err)
            res.error(err);
        }
    }

    async getAllDetail(req, res) {
        try {
            const provinces = await Provinces.find({}, "fullname name image information");
            res.success({ success: true, message: "get all provinces success", provinces })
        } catch (err) {
            console.log(err)
            res.error(err);
        }
    }

    async search(req, res) {
        try {
            var { q } = req.query;
            var provinces = await Provinces.find({ $text: { $search: q } }, { score: { $meta: "textScore" } }).limit(3)
                .sort({ score: { $meta: "textScore" } })
            provinces = provinces.map((item) => ({
                _id: item._id,
                fullname: item.fullname,
                link: `/province/${item.name}`,
                description: item.information,
                image: item.image,
                score: item._doc.score
            }))
            res.success({ success: true, results: provinces, query: q })
        }
        catch (err) {
            res.error(err);
        }
    }

}

module.exports = new ProvinceController;