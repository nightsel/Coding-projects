class Solution {
public:
    int maxTaskAssign(vector<int>& tasks, vector<int>& workers, int pills, int strength) {
        // if sorting worker and tasks, it's at least possible to get the highest strength worker on the highest strength task that they can handle. This would maximize the amount of tasks that workers can do if not taking into account strength pills.
        // However this doesn't take into account strength pills at all. A simple method would be to give strength pills to workers that barely couldn't complete a task.

        //at each step, check how many workers have enough strength to complete that amount of strength tasks. if that number is smaller and a pill would change something, then a pill should be used.
        // for example if theres 75 55 45 35 and workers are 75 55 35 25 and theres 2 pills with 10 strength, first should check that the 2 first tasks dont need it and on the 3rd task theres 3 tasks but only 2 workers above 45 strength. therefore a pill could be used.
        // the easiest way would be with logic after sorting both by strength. If task cannot be completed by any of the workers, see if using a pill would change that. If not, then don't use a pill and ignore the task. But this logic won't catch all the cases where using a pill on a strong worker isn't always the most optimal way. This is for example happening when that worker is capable of doing a task that no one else is capable of without a pill. Therefore using a pill on such a worker wouldn't achieve anything.
        // the sure way is to check how many tasks are possible first then test using a pill on each person individually to see if the amount increases but that takes too long computationally.
        // Could simplify by using a pill if there's an uncompletable task for a worker and then check if the rest of the workers completed the same amount of tasks as before. This would take 2*(n+l) time for each uncompletable task and leftover pill, where n is the amount of workers and l is the amount of tasks. So total time 2*(n+l)*pills for checking how pills should be used. If the pills are only useful on last 10 tasks then it could be 4*(n+l)^2 at worst.
        // one of the dangerous scenarios would be something like all tasks being 55 except the last 10 being 10s and the workers being 10 workers with strengths 45 0 0 0 0 0 0 0 0 0, with 9 pills left. it would be better to let the last 9 workers have the pill instead of letting 45 complete the 55 task.

        // if there's less tasks than workers, then strongest workers do strongest tasks. if there's less workers than tasks, then the least strong workers start doing tasks based on what is the least strength requiring.
        // If there's more workers than tasks it gets more complicated. Only the strongest workers should be included in calculations, everyone else are useless. Start from the end of the vector.
        // if there's too many impossible tasks for workers to complete, then the workers should be cut even more.
        std::sort(tasks.begin(),tasks.end());
        std::sort(workers.begin(),workers.end(),std::greater<>());
        int workercount = 0;
        for (int i = 0; i < workers.size() ; i++) {
            if (i < tasks.size()) {
                if (workers[i] >= tasks[i]) workercount++;
            }
        }
        workers.resize(workercount+pills);
        if (workers.size() >= tasks.size()) workers.resize(tasks.size());
        else tasks.resize(workers.size());

        std::sort(tasks.begin(),tasks.end(),std::greater<>());

        /*for (int i = 0 ; i < tasks.size() ; i++) {
            cout << "workers" << workers[i] << "\n";
            cout << "tasks" << tasks[i] << "\n";
        }*/

        int tasksdone = 0;
        for (int i =0; i< tasks.size() ; i++) {

            if (tasks[tasks.size()-1-i] <=workers[workers.size()-1-i]) {
                tasksdone++;
            }
            else if (pills > 0) {
                if((tasks[tasks.size()-1-i] <=workers[workers.size()-1-i]+strength)) {
                    tasksdone++;
                    pills--;
                }
            }
        }
        return tasksdone;
    }
};
