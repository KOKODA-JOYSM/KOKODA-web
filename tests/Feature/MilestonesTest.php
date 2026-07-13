<?php

namespace Tests\Feature;

use App\Models\Claim;
use App\Models\Location;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MilestonesTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_contains_requested_posts(): void
    {
        // Create user (claimant)
        $user = User::factory()->create();

        // Create post owner
        $owner = User::factory()->create();

        // Create location
        $location = Location::create([
            'user_id' => $owner->id,
            'place_name' => 'Tangerang Test',
            'latitude' => -6.223,
            'longitude' => 106.65,
        ]);

        // Create post
        $post = Post::create([
            'user_id' => $owner->id,
            'location_id' => $location->id,
            'title' => 'Lost Wallet',
            'description' => 'Black leather wallet lost near hall',
            'type' => 'lost',
            'status' => 'active',
        ]);

        // Create claim by claimant
        Claim::create([
            'post_id' => $post->id,
            'claimant_id' => $user->id,
            'owner_id' => $owner->id,
            'status' => 'pending',
            'message' => 'I lost my wallet there!',
        ]);

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();

        // Assert Inertia response has sentClaims and they match
        $inertiaData = $response->original->getData();
        $this->assertArrayHasKey('page', $inertiaData);
        $pageProps = $inertiaData['page']['props'];
        $this->assertArrayHasKey('sentClaims', $pageProps);
        
        $sentClaims = $pageProps['sentClaims'];
        $this->assertCount(1, $sentClaims);
        $this->assertEquals($post->id, $sentClaims[0]['post']['id']);
        $this->assertEquals('Lost Wallet', $sentClaims[0]['post']['title']);
        $this->assertEquals('Tangerang Test', $sentClaims[0]['post']['location']['place_name']);
    }

    public function test_locations_api_returns_coordinates(): void
    {
        // Create user
        $user = User::factory()->create();

        // Create location
        $location = Location::create([
            'user_id' => $user->id,
            'place_name' => 'Sentul Campus',
            'latitude' => -6.589,
            'longitude' => 106.883,
        ]);

        // Create active post referencing the location
        Post::create([
            'user_id' => $user->id,
            'location_id' => $location->id,
            'title' => 'Found Keys',
            'description' => 'Silver keychain',
            'type' => 'found',
            'status' => 'active',
        ]);

        $response = $this->get('/api/locations');

        $response->assertOk();

        $data = $response->json();
        $this->assertNotEmpty($data);
        $this->assertEquals('Sentul Campus', $data[0]);
    }
}
