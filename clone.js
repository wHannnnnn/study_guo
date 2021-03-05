function deepClone (obj, hash = new WeakMap()) {
    // 因为null == undefined，所以 null 与 undefined 直接返回
    // 如果是dom元素或基本类型值，直接返回
    const isElement = obj instanceof Element;
    const isEmpty = obj == undefined;
    const isNormalType = typeof obj !== 'object';

    if (isElement || isEmpty || isNormalType) return obj;

    // Object.prototype.toString.call，但window本身就是一个对象，所以直接toString.call()也是一样的
    // 当然这样写有风险，当某天window的toString被改写了，那程序就会出问题了，写文章还是严谨点
    let type = Object.prototype.toString.call(obj);
    
    switch (type) {
        case '[object Date]': return new Date(obj);
        case '[object RegExp]': return new RegExp(obj);
        case '[object Error]': return Error(obj);  // Error 与 new Error是一致的
    }

    if (hash.get(obj)) return obj;

    // 否则证明不是数组就是对象，需要递归拷贝
    // constructor保存着原函数的引用，因此直接不需要判断是数组还是对象来生成
    let clone = new obj.constructor;
    // 存储到weakMap中，下一次进来，先查找是否已有该值，有的话直接返回即可，用于解决循环引用
    hash.set(obj, clone);
    for (let key in obj) {
        clone[key] = deepClone(obj[key], hash);
    }
    
    return clone;
}