<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * Root ("/") diarahkan ke home feed.
     */
    public function test_the_root_redirects_to_home(): void
    {
        $response = $this->get('/');

        $response->assertRedirect(route('home'));
    }
}
