document.addEventListener('DOMContentLoaded', () => {
    // ============== بيانات التطبيق ==============
    const curriculumData = {
        'الأولى': {
            'الإنسان والصحة': {
                "التغذية عند الانسان": ["مصدر الأغذية", "تركيب الأغذية", "دور الأغذية في الجسم"],
                "التحصل على الطاقة": ["المبادلات الغازية", "المعنى البيولوجي للتنفس"]
            },
            'الإنسان والمحيط': {
                "التغذية عند النبات": ["الحاجيات الغذائية", "التركيب الضوئي"]
            }
        },
        'الثانية': {
            'الإنسان والمحيط': {
                "الوسط الحي": ["خصائص الوسط الحي", "النظام البيئي"]
            }
        }
    };

    let schedule = JSON.parse(localStorage.getItem('schedule')) || [];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // ============== العناصر DOM ==============
    const scheduleForm = document.getElementById('schedule-form');
    const taskForm = document.getElementById('task-form');
    const tasksListDiv = document.getElementById('tasks-list');
    const enableNotificationsBtn = document.getElementById('enable-notifications-btn');
    const notificationSound = document.getElementById('notification-sound');

    // ============== نظام التنبيهات ==============
    class NotificationSystem {
        constructor() {
            this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
            this.init();
        }

        async init() {
            await this.registerSW();
            await this.requestPermission();
        }

        async registerSW() {
            if ('serviceWorker' in navigator) {
                try {
                    this.registration = await navigator.serviceWorker.register('/service-worker.js');
                    console.log('Service Worker مسجل بنجاح');
                } catch (err) {
                    console.error('فشل تسجيل Service Worker:', err);
                }
            }
        }

        async requestPermission() {
            if (!('Notification' in window)) {
                console.warn('هذا المتصفح لا يدعم الإشعارات');
                return false;
            }

            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.updateUI(true);
                return true;
            }
            this.updateUI(false);
            return false;
        }

        updateUI(granted) {
            const btn = enableNotificationsBtn;
            if (granted) {
                btn.classList.remove('btn-outline-secondary');
                btn.classList.add('btn-success');
                btn.innerHTML = '<i class="fas fa-bell me-1"></i> التنبيهات مفعلة';
            } else {
                btn.classList.remove('btn-success');
                btn.classList.add('btn-outline-secondary');
                btn.innerHTML = '<i class="fas fa-bell me-1"></i> تفعيل التنبيهات';
            }
        }

        async showNotification(title, options) {
            // للهواتف
            if (this.isMobile && this.registration) {
                try {
                    await this.registration.showNotification(title, {
                        ...options,
                        vibrate: [300, 100, 400],
                        badge: '/icon-192.png',
                        dir: 'rtl'
                    });
                    this.playNotificationSound();
                    return true;
                } catch (err) {
                    console.error('فشل إرسال التنبيه:', err);
                    return this.showFallback(title, options.body);
                }
            }
            // لسطح المكتب
            else if (Notification.permission === 'granted') {
                new Notification(title, options);
                this.playNotificationSound();
                return true;
            }
            return false;
        }

        playNotificationSound() {
            if (notificationSound) {
                notificationSound.currentTime = 0;
                notificationSound.play().catch(e => console.error('لا يمكن تشغيل الصوت:', e));
            }
        }

        showFallback(title, body) {
            alert(`${title}\n${body}`);
            return false;
        }
    }

    const notificationSystem = new NotificationSystem();

    // ============== إدارة الجدول ==============
    function saveSchedule() {
        localStorage.setItem('schedule', JSON.stringify(schedule));
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'UPDATE_SCHEDULE',
                schedule: schedule
            });
        }
    }

    function renderScheduleTable() {
        // ... (كود عرض الجدول)
    }

    // ============== إدارة المهام ==============
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        scheduleNotifications();
    }

    function renderTasksList() {
        tasksListDiv.innerHTML = '';
        
        if (tasks.length === 0) {
            tasksListDiv.innerHTML = `
                <div class="alert alert-info text-center py-4">
                    <i class="fas fa-info-circle fa-2x mb-3"></i>
                    <h5 class="mb-2">لا توجد مهام حالياً</h5>
                    <p class="mb-0">قم بإضافة مهمة جديدة لبدء الاستخدام</p>
                </div>
            `;
            return;
        }

        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = `alert ${task.completed ? 'alert-success' : 'alert-primary'} task-item`;
            taskItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5><i class="fas ${task.completed ? 'fa-check-circle' : 'fa-bell'} me-2"></i> ${task.alertType}</h5>
                        <p><i class="fas fa-calendar-day me-2"></i> ${formatDate(task.date)}</p>
                        <p><i class="fas fa-clock me-2"></i> قبل ${task.notificationDuration} دقيقة</p>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-sm ${task.completed ? 'btn-outline-success' : 'btn-success'}" 
                                data-action="toggle" data-index="${index}">
                            <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" data-action="delete" data-index="${index}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-2">
                    <p><strong>القسم:</strong> ${task.level} ${task.classNumber}</p>
                    <p><strong>النشاط:</strong> ${task.activity}</p>
                </div>
            `;
            tasksListDiv.appendChild(taskItem);
        });
    }

    // ============== التنبيهات المجدولة ==============
    function scheduleNotifications() {
        // إلغاء جميع التنبيهات السابقة
        if (notificationSystem.registration) {
            notificationSystem.registration.getNotifications().then(notifications => {
                notifications.forEach(notification => notification.close());
            });
        }

        // جدولة تنبيهات جديدة
        tasks.forEach(task => {
            if (!task.completed) {
                const classSchedule = schedule.find(item => 
                    item.day === getDayFromDate(task.date) && 
                    item.level === task.level && 
                    item.classNumber === task.classNumber
                );
                
                if (classSchedule) {
                    const notifyTime = calculateNotifyTime(task.date, classSchedule.startTime, task.notificationDuration);
                    const now = new Date();
                    const timeDiff = notifyTime - now;

                    if (timeDiff > 0) {
                        setTimeout(() => {
                            notificationSystem.showNotification(
                                `تنبيه: ${task.alertType}`,
                                {
                                    body: `المهمة: ${task.text}\nالقسم: ${task.level} ${task.classNumber}`,
                                    icon: '/icon-192.png'
                                }
                            );
                        }, timeDiff);
                    }
                }
            }
        });
    }

    // ============== الأحداث ==============
    enableNotificationsBtn.addEventListener('click', () => notificationSystem.requestPermission());

    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(scheduleForm);
        const newItem = {
            day: formData.get('schedule-day'),
            startTime: formData.get('schedule-start-time'),
            endTime: formData.get('schedule-end-time'),
            level: formData.get('schedule-level-select'),
            classNumber: formData.get('schedule-class-number')
        };
        schedule.push(newItem);
        saveSchedule();
        renderScheduleTable();
        scheduleForm.reset();
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(taskForm);
        const classInfo = formData.get('task-class-select').split(' ');
        
        const newTask = {
            id: Date.now(),
            text: formData.get('task-text'),
            date: formData.get('task-date'),
            notificationDuration: parseInt(formData.get('task-notification-duration')),
            alertType: formData.get('task-alert-type'),
            level: classInfo[0],
            classNumber: classInfo[1],
            field: formData.get('task-field-select'),
            module: formData.get('task-module-select'),
            activity: formData.get('task-activity-select'),
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasksList();
        taskForm.reset();
    });

    // ============== دوال مساعدة ==============
    function getDayFromDate(dateString) {
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
        const date = new Date(dateString);
        return days[date.getDay()];
    }

    function calculateNotifyTime(dateString, timeString, minutesBefore) {
        const [year, month, day] = dateString.split('-');
        const [hours, minutes] = timeString.split(':');
        const taskTime = new Date(year, month - 1, day, hours, minutes);
        return new Date(taskTime.getTime() - (minutesBefore * 60000));
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-EG', options);
    }

    // التهيئة الأولية
    renderScheduleTable();
    renderTasksList();
    scheduleNotifications();
});