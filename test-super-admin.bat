@echo off
echo Testing Super Admin Signup...
echo.

curl -X POST "https://hr-portol-whitedavid23.onrender.com/api/auth/super-admin-signup" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"superadmin@company.com\",\"password\":\"admin123\",\"full_name\":\"Super Admin\",\"role\":\"super_admin\",\"admin_key\":\"hrportal-super-admin-2024\"}"

echo.
echo If successful, you should see a response with user data and token.
pause
