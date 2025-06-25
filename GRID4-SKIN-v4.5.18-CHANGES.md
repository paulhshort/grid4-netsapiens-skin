# Grid4 NetSapiens Portal Skin v4.5.18 - Critical Z-Index & Overlay Fixes

## Changes Summary
**Release Date:** June 24, 2025  
**Version:** v4.5.18  
**Previous Version:** v4.5.17  

## 🚨 CRITICAL FIXES

### Main Issues Fixed
1. **Dock/Chat overlaying content** - Fixed z-index hierarchy
2. **User toolbar breaking header** - Removed problematic CSS
3. **Chat positioning issues** - Let NetSapiens handle it

## 🔧 Key Changes

### Z-Index Hierarchy (Fixed)
```
- Content: 1
- Sidebar: 850  
- Header: 900
- Dock/Chat: 1000 (NetSapiens default)
- Dropdowns: 1050 (NetSapiens default)
- Modals: 1060 (NetSapiens default)
```

### CSS Changes
1. **Lowered header z-index** from 1050 to 900
2. **Lowered sidebar z-index** from 1000 to 850
3. **Removed chat positioning overrides** - let NetSapiens handle
4. **Removed aggressive user toolbar styling**
5. **Added content z-index: 1** to prevent overlaps

### What Was Removed
- All the user toolbar positioning/styling that broke header
- Chat message positioning overrides
- Aggressive dropdown styling

## Result
- Dock/chat no longer overlay content
- Proper stacking order maintained
- Header layout not broken
- NetSapiens handles positioning

## Deploy
Use cache buster: `?v=4518`