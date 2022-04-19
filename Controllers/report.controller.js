const Reports = require('../Models/report.model')

class ReportController {
    async createReport(req, res) {
        try {
            const { type, content, postId} = req.body;

            const newReport = new Reports({
                userId: req.user._id, type, content, postId
            });

            await newReport.save();
            
            res.success({ success: true, message: "Báo cáo bài viết thành công!", newReport })
        } catch (err) {
            res.error(err);
        }
    }
    //admin lấy tất cả report
    async getReports(req, res) {
        try {
            const reports = await Reports.find({ }).sort('-updatedAt')
            .populate('userId', 'avatar username fullname')
            res.success({
                success: true,
                message: "Lấy tất cả các báo cáo thành công!",
                reports
            })
        }
        catch (err) {
            res.err(err)
        }
    }

    async deleteReport(req, res) {
        try {
            const { id } = req.params;
            await Reports.findByIdAndDelete(id)
            res.success({
                success: true,
                message: "Xóa báo cáo thành công!",
            })
        }
        catch (err) {
            res.error(err);
        }
    }

    async getReport(req, res) {
        try {
            const report = await Reports.findById({_id: req.params.id})
                .populate('userId', 'avatar username fullname')
            if (report) {
                await Reports.findOneAndUpdate({ _id: req.params.id}, {
                   state: 1
                })
                res.success({
                    success: true,
                    message: "Lấy thông tin một report thành công!",
                    report
                })
            }
            else {
                res.notFound("Không tìm thấy báo cáo")
            }
        }
        catch (err) {
            res.error(err);
        }
    }

    async finish(req, res) {
        try {
            const report = await Reports.findOneAndUpdate({ _id: req.params.id}, {
                state: 2
            },{new: true})
            if (report) {
                res.success({
                    success: true,
                    message: "Đã xứ lý xong báo cáo!",
                    report
                })
            }
            else {
                res.notFound("Không tìm thấy báo cáo")
            }
        }
        catch (err) {
            res.error(err);
        }
    }
}

module.exports = new ReportController;