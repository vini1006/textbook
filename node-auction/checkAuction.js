//낙찰자가 없는 경매를 찾아서 낙찰자를 지정해주는 코드 ?

const { Op } = require('sequelize'); //옵션

const { Good, Auction, User, sequelize } = require('./models');

module.exports = async () => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); //어제시간
        const targets = await Good.findAll({
            where: {
                SoldId: null,
                createdAt: { [Op.lte]: yesterday}
            }
        });
        targets.forEach(async (target) => {
            const success = await Auction.findOne({ //완료는 됐는데 아직 선정이 안된거?
                where: { GoodId: target.id },
                order: [['bid', 'DESC']]
            });
            await Good.update({ SoldId: success.UserId }, { where: { id: target.id} });
            await User.update({
                money: sequelize.literal(`money - ${success.bid}`)
            }, {
                where: { id: success.UserId }
            });
        });
    } catch (err) {
        console.error(err);
    }
}
