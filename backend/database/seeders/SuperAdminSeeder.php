<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();  // Start the transaction

        try {
            // Check if this is the first admin
            $isFirstAdmin = Admin::count() === 0;

            if ($isFirstAdmin) {
                // Create the Super Admin user
                $superAdmin = Admin::create([
                    'email' => env('Super_Admin_Email'),
                    'name' => env('SUPER_ADMIN_FIRSTNAME') . ' ' . env('SUPER_ADMIN_LASTNAME'),
                    'is_super_admin' => 1,
                ]);
               

            }

            DB::commit();  // Commit the transaction if all goes well
        } catch (QueryException $e) {
            DB::rollBack();  // Rollback the transaction if there is an error
            // Log the error or handle it in a way that fits your application
            \Log::error("Error seeding SuperAdmin: " . $e->getMessage());
            // Optionally rethrow the exception if needed
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();  // Rollback the transaction for any other exceptions
            \Log::error("Unexpected error seeding SuperAdmin: " . $e->getMessage());
            throw $e;
        }
    }
}
