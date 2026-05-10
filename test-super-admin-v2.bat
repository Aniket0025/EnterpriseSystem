@echo off
echo Testing Super Admin Signup...
curl -X POST "https://hr-portol-whitedavid23.onrender.com/api/auth/super-admin-signup" -H "Content-Type: application/json" -d "{\"email\":\"superadmin@company.com\",\"password\":\"admin123\",\"full_name\":\"Super Admin\",\"role\":\"super_admin\",\"admin_key\":\"hrportal-super-admin-2024\"}"
echo.
pause
