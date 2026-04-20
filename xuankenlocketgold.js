const mapping = {
    '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip', 'com.locket02.premium.yearly'],
    'Locket': ['Gold', 'com.locket02.premium.yearly']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);

obj.Attention = "By: XuanKen - Full Locket Gold";

var subscriptionData = {
    is_sandbox: false,
    ownership_type: "PURCHASED",
    billing_issues_detected_at: null,
    period_type: "normal",
    expires_date: "2099-12-18T01:04:17Z",
    grace_period_expires_date: null,
    unsubscribe_detected_at: null,
    original_purchase_date: "2026-01-01T00:00:00Z",
    purchase_date: "2026-01-01T00:00:00Z",
    store: "app_store"
};

const match = Object.keys(mapping).find(key => ua.includes(key));

if (match) {
    let [entitlementId, productId] = mapping[match];
    
    // Tạo object mới để tránh tham chiếu
    let newEntitlementData = {
        grace_period_expires_date: null,
        purchase_date: "2026-01-01T00:00:00Z",
        product_identifier: productId,
        expires_date: "2099-12-18T01:04:17Z"
    };
    
    obj.subscriber.subscriptions[productId] = subscriptionData;
    obj.subscriber.entitlements[entitlementId] = newEntitlementData;
    
    // Nếu cần thêm cả Gold
    if (entitlementId === 'vip+watch_vip') {
        let goldData = {
            grace_period_expires_date: null,
            purchase_date: "2026-01-01T00:00:00Z",
            product_identifier: "com.locket02.premium.yearly",
            expires_date: "2099-12-18T01:04:17Z"
        };
        obj.subscriber.entitlements['Gold'] = goldData;
    }
} else {
    // Mặc định
    obj.subscriber.subscriptions["com.locket02.premium.yearly"] = subscriptionData;
    obj.subscriber.entitlements["Gold"] = {
        grace_period_expires_date: null,
        purchase_date: "2026-01-01T00:00:00Z",
        product_identifier: "com.locket02.premium.yearly",
        expires_date: "2099-12-18T01:04:17Z"
    };
}

$done({
    body: JSON.stringify(obj)
});
