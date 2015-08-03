<?php

use Illuminate\Database\Seeder;
use App\Repositories\Repositories\FolderRepository;
use Faker\Factory;

class FoldersSeeder extends Seeder
{
    private $folderRepository;

    public function __construct(FolderRepository $folderRepository)
    {
        $this->folderRepository = $folderRepository;
    }


    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Factory::create();
        
        for ($i = 0; $i < 5; $i++) {
            $this->folderRepository->create(['title' => $faker->unique()->word]);
        }
    }
}