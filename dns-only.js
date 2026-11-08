/*
 * DNS 设置精简版
 *
 * 参考 Whisper.js 的 DNS 配置。
 * 保留原订阅的节点、策略组、规则及规则集。
 *
 * 注意：实际效果仍需在 Clash 中测试。
 */

function main(config) {
  if (!config || typeof config !== "object") {
    return config;
  }

  // 保留原有 TUN 设置，只调整普通 DNS 的劫持入口。
  // 此处不会替你开启 TUN；请确认 Clash 的 TUN 已启用。
  config.tun = {
    ...(config.tun || {}),
    "dns-hijack": ["any:53"]
  };

  // 参考原脚本的 DNS 配置。
  config.dns = {
    "enable": true,
    "respect-rules": true,
    "ipv6": true,
    "prefer-h3": false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",

    // 用于解析部分 DNS 服务自身的地址。
    "default-nameserver": [
      "223.5.5.5",
      "119.29.29.29",
      "2400:3200::1"
    ],

    // 默认 DNS。
    "nameserver": [
      "https://dns.cloudflare.com/dns-query",
      "https://dns.google/dns-query"
    ],

    // 节点域名解析。
    "proxy-server-nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    // 直连流量的 DNS。
    "direct-nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    "nameserver-policy": {
      "dns.cloudflare.com": [
        "1.1.1.1",
        "1.0.0.1"
      ],

      "dns.google": [
        "8.8.8.8",
        "8.8.4.4"
      ],

      "dns.alidns.com": [
        "223.5.5.5",
        "223.6.6.6"
      ],

      "doh.pub": [
        "1.12.12.12",
        "120.53.53.53"
      ],

      "geosite:cn": [
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"
      ]
    },

    "fallback": [
      "https://anycast.uncensoreddns.org/dns-query"
    ],

    "fallback-filter": {
      "geoip": true,
      "geoip-code": "CN",
      "ipcidr": [
        "240.0.0.0/4",
        "127.0.0.0/8",
        "0.0.0.0/32"
      ]
    },

    "fake-ip-filter": [
      "geosite:cn",
      "*.lan",
      "*.local",
      "localhost",
      "*.msftconnecttest.com",
      "*.msftncsi.com",
      "*.msidentity.com",
      "captive.apple.com",
      "*.push.apple.com",
      "stun.*",
      "+.stun.*.*",
      "+.stun.*.*.*",
      "+.stun.*.*.*.*",
      "+.stun.*.*.*.*.*",
      "speedtest.net"
    ]
  };

  return config;
}
