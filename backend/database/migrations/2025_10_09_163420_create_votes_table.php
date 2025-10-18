<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            
            // Voter details
            $table->string('voter_fullname');
            $table->string('voter_email');
            
            // Contestant details
            $table->uuid('contestant_id')->nullable(); // use UUID since contestants.id is UUID
            $table->string('contestant_email');
            $table->string('contestant_name');
            $table->string('contestant_number');
            $table->string('status');
            
            // Payment details
            $table->string('account_number')->nullable();
            $table->string('account_name')->nullable();
            $table->string('bank_name')->nullable();
            $table->decimal('amount', 12, 2);
            $table->string('currency')->default('NGN');
            $table->string('flw_ref')->unique();
            $table->string('tx_ref')->unique();
            $table->timestamp('payment_time')->nullable();
            
            // Votes allocated based on transfer
            $table->unsignedSmallInteger('votes_allocated')->default(0);

            $table->boolean('frontend_requested')->default(false);
            
            // Index for faster leaderboard queries
            $table->index(['contestant_number', 'status']);

            // ✅ Proper cascade relationship
            $table->foreign('contestant_id')
                ->references('id')
                ->on('contestants')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
