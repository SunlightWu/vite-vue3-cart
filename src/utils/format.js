export const formatPrice = (value) => {
    /* 保留小数后两位 */
    let s = value.toFixed(2)
    /* 千位分隔符 */
    let res = s.toString().replace(/\d+/, function (n) { // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ",";
        });
    })
    return res;

}

