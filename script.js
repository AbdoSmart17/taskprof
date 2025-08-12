document.addEventListener('DOMContentLoaded', () => {
    // --- عناصر DOM ---
    const scheduleForm = document.getElementById('schedule-form');
    const scheduleDaySelect = document.getElementById('schedule-day');
    const scheduleStartTimeInput = document.getElementById('schedule-start-time');
    const scheduleEndTimeInput = document.getElementById('schedule-end-time');
    const scheduleLevelSelect = document.getElementById('schedule-level-select');
    const scheduleClassNumberInput = document.getElementById('schedule-class-number');
    const scheduleTableBody = document.querySelector('#schedule-table tbody');
    
    const taskForm = document.getElementById('task-form');
    const taskDateInput = document.getElementById('task-date');
    const taskNotificationDurationInput = document.getElementById('task-notification-duration');
    const taskAlertTypeSelect = document.getElementById('task-alert-type');
    const taskClassSelect = document.getElementById('task-class-select');
    const taskFieldSelect = document.getElementById('task-field-select');
    const taskModuleSelect = document.getElementById('task-module-select');
    const taskActivitySelect = document.getElementById('task-activity-select');
    const taskText = document.getElementById('task-text');
    const tasksListDiv = document.getElementById('tasks-list');
    const enableNotificationsBtn = document.getElementById('enable-notifications-btn');
    
    // أزرار تصفية المهام
    const showAllTasksBtn = document.getElementById('show-all-tasks');
    const showPendingTasksBtn = document.getElementById('show-pending-tasks');
    const showCompletedTasksBtn = document.getElementById('show-completed-tasks');
    
    // عنصر الصوت للتنبيهات
    const notificationSound = document.getElementById('notification-sound');

    // --- بيانات التطبيق ---
    let schedule = JSON.parse(localStorage.getItem('schedule')) || [];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentTaskFilter = 'all';
    
    // بيانات المناهج الدراسية
    const curriculumData = {
        'الأولى': {
            'الإنسان والصحة': {
                "التغذية عند الانسان ": ["مصدر الأغذية", "تركيب الأغذية (تحليل تركيب الحليب )", "تركيب الأغذية (تحليل تركيب أغذية اخرى )", "دور الأغذية في الجسم ", "الحاجيات الغذائية للعضوية ", "الراتب الغذائي ", "التوازن الغذائي (عواقب سوء التغذية )", "وضعية تعلم ادماج الموارد"],
                "التحصل على الطاقة عند الانسان": [" المبادلات الغازية التنفسية عند الانسان ", " المعنى البيولوجي للتنفس", " القواعد الصحية للتنفس ", " وضعية تعلم ادماج الموارد"],
                "الاطراح وثبات توازن الوسط الداخلي": [" تعريف الاطراح عند الانسان ", " دور أعضاء الاطراح ", " القواعد الصحية للاطراح ", " وضعية تعلم ادماج الموارد"],
                "التكاثر الجنسي عند الانسان": [" الأجهزة التكاثرية عند الانسان ", " الالقاح وشروطه", " القواعد الصحية للتكاثر ", " وضعية تعلم ادماج الموارد"],
                "الخلية": [" مفهوم الخلية ", " المجهر الضوئي ", "الخلية الحيوانية "],
            },
            'الإنسان والمحيط': {
                "التغذية عند النبات الأخضر": [" الحاجيات الغذائية للنبات الأخضر ", " تأثير تركيز المحلول المعدني على نمو النبات ", " مقر امتصاص المحلول المعدني", " المبادلات الغازية اليخضورية ومقرها ", " التركيب الضوئي وشروطه", " أهمية التحكم في شروط التركيب الضوئي ", " مسار النسغ الخام في النبات الأخضر ", " دور النتح في انتقال النسغ /مصير النسغ", " وضعية تعلم ادماج الموارد"],
                "التحصل على الطاقة عند النبات الأخضر": [" المبادلات الغازية التنفسية عند النبات الأخضر ", " مقر المبادلات الغازية التنفسية عند النبات الأخضر", " المعنى البيولوجي للتنفس عند النبات ", " اشكال أخرى للتحصل على الطاقة (التخمر)", " وضعية تعلم ادماج الموارد"],
                "التكاثر الجنسي عند النباتات الزهرية ": [" الأجهزة التكاثرية عند النبات الزهري", " الالقاح وشروطه", " وضعية تعلم ادماج الموارد"],
                "الخلية النباتية": [" مفهوم الخلية ", " المجهر الضوئي ", " الخلية النباتية "],
            }
        },
        'الثانية': {
            'الإنسان والمحيط': {
                "الوسط الحي": ["خصائص الوسط الحي", "العلاقات القائمة بين العناصر الحية في الوسط الحي", "تأثير العوامل الفيزيوكيميائية على توزع الكائنات الحية ونشاطها", "النظام البيئي وشروط توازنه", "دور الانسان في استقرار النظام البيئي", " وضعية تعلم ادماج الموارد"],
                "توزّع الكائنات الحية في أوساطها": ["مظاهر تكيف النباتات مع اوساطها ", "تنفس الحيوانات واحتلال الأوساط", "تأثير الانسان على التوزع الطبيعي للحيوانات ", "العلاقة بين وسط حياة حيوان ونمط تنقله", " وضعية تعلم ادماج الموارد"],
                "التكاثر وإعمار الأوساط": ["أنماط التكاثر عند الحيوان", "أنماط التكاثر عند النباتات", "تأثير الإنسان على إعمار الأوساط", " وضعية تعلم ادماج الموارد"],
                "تصنيف الكائنـــات الحيــــة": ["مفهوم النوع عند الكائنات الحية ", "استخدام معايير التصنيف ", " وضعية تعلم ادماج الموارد"],
                "المستحاثات": ["المستحاثات وشروط الاستحاثة ", "مكانة المستحاثات في تصور الأوساط القديمة ", " وضعية تعلم ادماج الموارد"],
            }
        },
        'الثالثة': {
            "الإنسان والمحيط (الديناميكية الداخلية للكرة الارضية)": {
                "الزلازل": ["مظاهر وعواقب زلزال", "خصائص الزلزال", "النشاط الزلزالي لشمال افريقيا"],
                "أسباب الزلازل": ["الربط بين حدوث الزلزال وتشكل الجبال (الطيات والفوالق)", "اختبار فرضية مصدر الزلزال"],
                "نشاط الظهرات ": ["الشواهد الدالة على زحزحة القارات ", "ابراز العلاقة بين زحزحة القارات والظهرات", "تفسير زحزحة القارات بنشاط الظهرات (أنماط ص تكتونية/ تيارات الحمل)"],
                "الغوص والظواهر الجيولوجية المرتبطة به ": ["بناء مفهوم الغوص (الية حركة تقارب الصفائح التكتونية)", "الظواهر الجيولوجية المرتبطة بالغوص ( البركنة المرتبطة بالغوص /جبال الهيمالايا ) "],
                "التكتونية العامة و البنية الداخلية للكرة الأرضية": [" الاليات التفسيرية لاهم الظواهر الجيولوجية (تغير سرعة انتشار الأمواج الزلزالية)", "وصف البنية الداخلية للكرة الأرضية"],
                "التكتونية في حوض البحر المتوسط ": ["تفسير الظواهر الجيولوجية في حوض البحر المتوسط (سلسلة جبال الاطلس)", "النشاط الزلزالي والبركاني في إيطاليا"],
                "الإجراءات الوقائية والتنبئية المتعلقة بالظواهر الجيولوجية": ["التقيد بالإجراءات الوقائية (انجاز بحث حول الاحتياطات الواجب اتخاذها)", "وضعية تعلم ادماج الموارد "],
            },
            " الانسان والمحيط (الديناميكية الخارجية للكرة الأرضية) ": {
                " البنيات الجيولوجية الكبرى وخصائصها": ["تمييز المركبات الكبرى للمناظر الطبيعية", " تفسير اصل الاختلافات الملاحظة بين المناظر الطبيعية (مكاشف الصخور)"],
                "تشكل المنظر الطبيعي وطبيعة الصخور ": [" إحصاء أنواع الصخور المشكلة للمناظر الطبيعية في الجزائر", " الخواص الفيزيوكيميائية للصخور (تحديد خاصيتين فيزيوكيميائيتين)", "الربط بين خواص الصخور وتشكل المنظر الطبيعي"],
                " أثر العوامل المناخية في تغير المنظر الطبيعي ": [" آليات التأثير الفيزيوكيميائي للعوامل المناخية على الصخور (الماء / الرياح / الحرارة )", " التعرف على ملامح تغير تضاريس المنظر الطبيعي "],
                " تطور شكل المنظر الطبيعي": [" التدخلات السلبية والايجابية للإنسان على تطور منظر طبيعي", "تطور منظر طبيعي عبر الزمن الجيولوجي (الى الشكل الحالي )", "وضعية تعلم ادماج الموارد "],
            },
            "الانسان والمحيط ( استغلال الموارد الطبيعية الباطنية)": {
                "الثروات الطبيعية الباطنية في الجزائر": [" التعرف على اهم الموارد الطبيعية الباطنية في الجزائر "],
                "مميزات الموارد الطبيعية في الجزائر": ["خواص البترول ومراحل تشكله / تحديد مواضع تواجد الماء"],
                "استغلال الموارد الطبيعية ": ["كيفية استغلال الموارد الباطنية (البترول والماء )", " ابراز ضرورة الاستغلال العقلاني للموارد الباطنية ", "وضعية تعلم ادماج الموارد"],
            },
            "الانسان والمحيط (التربة ثروة طبيعية هشة)": {
                " التربة وسط حي ": [" التعرف على التربة ", " العلاقة بين بنية التربة ومكوناتها الحية", " الطابع الهش للتربة"],
                " تشكل التربة ": [" منشأ التربة ", " مراحل تشكل التربة "],
                " حماية التربة " : [" التدخل السلبي والايجابي للإنسان على التربة الزراعية ", " وضعية تعلم ادماج الموارد", " وقفة تقييمية (الفرض )"],
            }
        },
        'الرابعة': {
            "الانسان والصحة (التغذية عند الانسان)": {
                " تحويل الأغذية خلال الهضم": [" تشخيص المكتسبات (الوضعية الانطلاقية الشاملة) ", " ابراز التحولات التي تطرا على مكونات غذاء (الخبز) في مختلف مستويات الانبوب الهضمي ", " بناء مفهوم الهضم ( التأثير النوعي للإنزيم) ", " المعنى البيولوجي للهضم"],
                " امتصاص المغذيات": [" مصير الأغذية المهضومة ", " مميزات مقر امتصاص المغذيات"],
                " نقل المغذيات": [" ابين دور الدم", " الفرض 1", " مسار نقل المغذيات والغازات"],
                " استعمال المغذيات": [" استعمال غاز الاكسجين والمغذيات في نسيج حي ", " تصحيح الفرض ", " التنفس الخلوي عند خميرة الخبز", " دور المغذيات في الجسم"],
                " التوازن الغذائي": [" عواقب التغذية الغير صحية (حل وضعيات ادماج لمختلف الاختلالات المتعلقة بالتغذية )", " حصة ادماج كلي للمقطع 01 "],
            },
            " الانسان والصحة (التنسيق الوظيفي في العضوية)": {
                " الارتباط التشريحي للاتصال العصبي ": [" اتعرف على البنيات المتخصصة في استقبال التنبيهات ", "اظهر الدعامة البنيوية للاتصال العصبي ", " احدد مظهر الرسائل وطرائق انتقالها"],
                " الحركة الارادية والفعل الحركي اللاإرادي": [" احلل حركة ارادية ", " اميز خصوصيات الحركة اللاإرادية "],
                " اختلال الاتصال العصبي": [" ابين تأثير مختلف المواد المخدرة وعواقبها ", " حل الوضعية الانطلاقية (معالجة بيداغوجية)"],
                " الحواجز الطبيعية والاجسام الغريبة ": [" الحواجز الطبيعية التي تستعملها العضوية من اجل الحماية "],
                " الاستجابة المناعية اللانوعية": [" اظهر مميزات الخط الدفاعي الثاني للعضوية"],
                " الاستجابة المناعية النوعية": [" اشرح الية الخط الدفاعي الثالث للعضوية"],
                " الذات و اللاذات": [" ابين قدرة العضوية على تمييز الذات عن اللاذات ", "وقفة تقييمية"],
                " الاعتلالات المناعية": [" اتعرف على حالة اعتلال مناعي (الحساسية)", " اشرح مبدا العون المناعي", " حصة ادماج كلي للمقطع 02"],
            },
            "الانسان و الصحة (انتقال الصفات الوراثية)": {
                " تشكل الامشاج والالقاح ": [" طرح الوضعية الانطلاقية ", " اصف مراحل تشكل الامشاج الذكريه والانثوية", " احلل سلوك الصبغيات اثناء تشكل الامشاج لتعريف النمط النووي", " ابين دور الالقاح في ضمان استمرارية النوع"],
                " دعامة انتقال الصفات الوراثية ": [" اقارن بين صفات مجموعة من الافراد", " ابين مقر المعلومة الوراثية "],
                " الاختلالات الوراثية ": [" أتعرف على بعض الاختلالات الكروموزومية ", " احدد اسباب بعض الامراض الوراثية", " أحدد معنى الطفرة الوراثية", " أبين خطورة الزواج بين ذوي الأقارب", " حل الوضعية الانطلاقية - معالجة بيداغوجية محتملة", " الفرض الاخير - تصحيح الفرض", " حل الوضعية الشاملة "],
            }
        }
    };

    // --- وظائف الجدول الزمني ---
    const getDayFromDate = (dateString) => {
        const date = new Date(dateString.replace(/-/g, '/'));
        const daysOfWeekArabic = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        return daysOfWeekArabic[date.getDay()];
    };

    const saveSchedule = () => {
        localStorage.setItem('schedule', JSON.stringify(schedule));
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'UPDATE_SCHEDULE',
                schedule: schedule
            });
        }
    };

    const renderScheduleTable = () => {
        scheduleTableBody.innerHTML = '';
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
        
        // جمع جميع أوقات البداية
        const allStartTimes = [...new Set(schedule.map(item => item.startTime))].sort();
        
        if (allStartTimes.length === 0) {
            scheduleTableBody.innerHTML = `<tr><td colspan="6" class="text-muted text-center">لم يتم إضافة حصص بعد.</td></tr>`;
            return;
        }

        allStartTimes.forEach(time => {
            const row = document.createElement('tr');
            const timeCell = document.createElement('td');
            timeCell.textContent = time;
            row.appendChild(timeCell);

            days.forEach(day => {
                const dayCell = document.createElement('td');
                const matchingItems = schedule.filter(item => item.day === day && item.startTime === time);
                
                if (matchingItems.length > 0) {
                    matchingItems.forEach(item => {
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'schedule-item-cell';
                        itemDiv.innerHTML = `
                            <p class="mb-1">${item.level} ${item.classNumber}</p>
                            <p class="mb-1">${item.startTime} - ${item.endTime}</p>
                            <button class="btn-delete-schedule" data-id="${item.day}-${item.startTime}-${item.level}-${item.classNumber}">
                                <i class="fa-solid fa-trash-alt"></i>
                            </button>
                        `;
                        dayCell.appendChild(itemDiv);
                    });
                }
                row.appendChild(dayCell);
            });
            scheduleTableBody.appendChild(row);
        });

        // إضافة حدث الحذف للجدول
        scheduleTableBody.querySelectorAll('.btn-delete-schedule').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idParts = e.currentTarget.dataset.id.split('-');
                const [day, startTime, level, classNumber] = idParts;
                
                schedule = schedule.filter(item => 
                    !(item.day === day && 
                      item.startTime === startTime && 
                      item.level === level && 
                      item.classNumber === classNumber)
                );
                
                saveSchedule();
                renderScheduleTable();
            });
        });
    };

    // --- وظائف المهام ---
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        scheduleNotifications();
        
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'UPDATE_TASKS',
                tasks: tasks
            });
        }
    };

    const renderTasksList = () => {
        tasksListDiv.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (currentTaskFilter === 'pending') return !task.completed;
            if (currentTaskFilter === 'completed') return task.completed;
            return true;
        });
        
        if (filteredTasks.length === 0) {
            tasksListDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fa-solid fa-info-circle me-2"></i>
                    لا توجد مهام ${getFilterText(currentTaskFilter)}.
                </div>
            `;
            return;
        }
        
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = `alert ${getTaskAlertClass(task)} d-flex justify-content-between align-items-center mb-3`;
            taskItem.innerHTML = `
                <div class="task-content flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="mb-2">
                            <i class="fa-solid ${task.completed ? 'fa-check-circle' : 'fa-bell'} me-2"></i>
                            ${task.alertType}
                        </h5>
                        <small class="text-muted">${formatDate(task.date)}</small>
                    </div>
                    
                    <div class="task-details mt-2">
                        <p class="mb-1">
                            <span class="badge ${task.completed ? 'bg-success' : 'bg-primary'} me-2">
                                <i class="fa-solid fa-clock me-1"></i>
                                قبل ${task.notificationDuration} دقيقة
                            </span>
                            <span class="badge bg-secondary">
                                <i class="fa-solid fa-graduation-cap me-1"></i>
                                ${task.level} ${task.classNumber}
                            </span>
                        </p>
                        
                        <div class="mt-2">
                            <p class="mb-1"><strong>الميدان:</strong> ${task.field}</p>
                            <p class="mb-1"><strong>المقطع:</strong> ${task.module}</p>
                            <p class="mb-1"><strong>النشاط:</strong> ${task.activity}</p>
                            ${task.text ? `<p class="mb-0"><strong>ملاحظات:</strong> ${task.text}</p>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="task-actions ms-3">
                    <button class="btn btn-sm ${task.completed ? 'btn-outline-success' : 'btn-success'}" 
                            data-action="toggle" 
                            data-index="${index}"
                            title="${task.completed ? 'إعادة فتح المهمة' : 'تم الإنجاز'}">
                        <i class="fa-solid ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="btn btn-sm btn-danger mt-2" 
                            data-action="delete" 
                            data-index="${index}"
                            title="حذف المهمة">
                        <i class="fa-solid fa-trash-alt"></i>
                    </button>
                </div>
            `;
            tasksListDiv.appendChild(taskItem);
        });

        // إضافة أحداث النقر للأزرار
        tasksListDiv.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', handleTaskAction);
        });
    };

    const handleTaskAction = (e) => {
        const btn = e.currentTarget;
        const action = btn.dataset.action;
        const index = parseInt(btn.dataset.index);
        
        if (action === 'delete') {
            if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasksList();
            }
        } else if (action === 'toggle') {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasksList();
        }
    };

    const getTaskAlertClass = (task) => {
        if (task.completed) return 'alert-success';
        const now = new Date();
        const taskDate = new Date(task.date);
        
        if (taskDate < now) return 'alert-danger';
        return 'alert-primary';
    };

    const getFilterText = (filter) => {
        return filter === 'pending' ? 'معلقة' : filter === 'completed' ? 'مكتملة' : '';
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-EG', options);
    };

    // --- وظائف التنبيهات ---
    const showNotification = (title, options) => {
        if (!('Notification' in window)) return;
        
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, options);
            
            // تشغيل صوت التنبيه
            if (notificationSound) {
                notificationSound.currentTime = 0;
                notificationSound.play().catch(e => console.error('Error playing sound:', e));
            }
            
            // إغلاق الإشعار بعد 10 ثوان
            setTimeout(() => notification.close(), 12000);
            
            // عند النقر على الإشعار، يتم فتح التطبيق
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    };

    const scheduleNotifications = () => {
        // إلغاء جميع التنبيهات السابقة
        tasks.forEach(task => {
            if (task.notificationTimeout) {
                clearTimeout(task.notificationTimeout);
                delete task.notificationTimeout;
            }
        });
        
        // جدولة التنبيهات الجديدة
        tasks.forEach(task => {
            if (!task.completed) {
                const classSchedule = schedule.find(item => 
                    item.day === getDayFromDate(task.date) && 
                    item.level === task.level && 
                    item.classNumber === task.classNumber
                );
                
                if (classSchedule) {
                    const [year, month, day] = task.date.split('-');
                    const [hours, minutes] = classSchedule.startTime.split(':');
                    
                    const classTime = new Date(year, month - 1, day, hours, minutes);
                    const notificationTime = new Date(classTime.getTime() - (task.notificationDuration * 60000));
                    const now = new Date();
                    const timeDiff = notificationTime.getTime() - now.getTime();
                    
                    if (timeDiff > 0) {
                        task.notificationTimeout = setTimeout(() => {
                            showNotification(
                                `تنبيه: ${task.alertType}`,
                                {
                                    body: `لديك مهمة: ${task.text}\nمع قسم ${task.level} ${task.classNumber}\nموعد الحصة: ${classSchedule.startTime}`,
                                    icon: '/icon-192.png',
                                    badge: '/icon-192.png'
                                }
                            );
                        }, timeDiff);
                    }
                }
            }
        });
    };

    const enableNotifications = async () => {
        if (!('Notification' in window)) {
            alert('متصفحك لا يدعم إشعارات سطح المكتب');
            return;
        }
        
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                updateNotificationButton(true);
                alert('تم تفعيل التنبيهات بنجاح! سيتم إعلامك بالمهام في المواعيد المحددة.');
                scheduleNotifications();
            } else {
                updateNotificationButton(false);
                alert('تم رفض إذن الإشعارات. لن تتمكن من تلقي التنبيهات.');
            }
        } catch (error) {
            console.error('خطأ في تفعيل التنبيهات:', error);
            alert('حدث خطأ أثناء محاولة تفعيل التنبيهات.');
        }
    };

    const updateNotificationButton = (enabled) => {
        if (enabled) {
            enableNotificationsBtn.classList.remove('btn-outline-secondary');
            enableNotificationsBtn.classList.add('btn-success');
            enableNotificationsBtn.innerHTML = '<i class="fa-solid fa-bell me-1"></i> التنبيهات مفعلة';
        } else {
            enableNotificationsBtn.classList.remove('btn-success');
            enableNotificationsBtn.classList.add('btn-outline-secondary');
            enableNotificationsBtn.innerHTML = '<i class="fa-solid fa-bell me-1"></i> تفعيل التنبيهات';
        }
    };

    // --- وظائف تعبئة القوائم المنسدلة ---
    const populateClassSelect = (selectedDate) => {
        taskClassSelect.innerHTML = '<option value="">اختر قسم</option>';
        
        if (!selectedDate) return;
        
        const day = getDayFromDate(selectedDate);
        const classes = schedule.filter(item => item.day === day);
        
        if (classes.length === 0) {
            taskClassSelect.innerHTML = '<option value="">لا توجد حصص في هذا اليوم</option>';
            return;
        }
        
        const uniqueClasses = [...new Set(classes.map(item => `${item.level} ${item.classNumber}`))];
        
        uniqueClasses.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls;
            option.textContent = cls;
            taskClassSelect.appendChild(option);
        });
    };

    const populateFieldSelect = (level) => {
        taskFieldSelect.innerHTML = '<option value="">اختر ميدان</option>';
        
        if (!level || !curriculumData[level]) return;
        
        Object.keys(curriculumData[level]).forEach(field => {
            const option = document.createElement('option');
            option.value = field;
            option.textContent = field;
            taskFieldSelect.appendChild(option);
        });
    };

    const populateModuleSelect = (level, field) => {
        taskModuleSelect.innerHTML = '<option value="">اختر مقطع</option>';
        
        if (!level || !field || !curriculumData[level]?.[field]) return;
        
        Object.keys(curriculumData[level][field]).forEach(module => {
            const option = document.createElement('option');
            option.value = module;
            option.textContent = module;
            taskModuleSelect.appendChild(option);
        });
    };

    const populateActivitySelect = (level, field, module) => {
        taskActivitySelect.innerHTML = '<option value="">اختر نشاط</option>';
        
        if (!level || !field || !module || !curriculumData[level]?.[field]?.[module]) return;
        
        curriculumData[level][field][module].forEach(activity => {
            const option = document.createElement('option');
            option.value = activity;
            option.textContent = activity;
            taskActivitySelect.appendChild(option);
        });
    };

    // --- أحداث DOM ---
    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newScheduleItem = {
            day: scheduleDaySelect.value,
            startTime: scheduleStartTimeInput.value,
            endTime: scheduleEndTimeInput.value,
            level: scheduleLevelSelect.value,
            classNumber: scheduleClassNumberInput.value
        };
        
        schedule.push(newScheduleItem);
        saveSchedule();
        scheduleForm.reset();
        renderScheduleTable();
    });

    taskDateInput.addEventListener('change', () => {
        populateClassSelect(taskDateInput.value);
        taskFieldSelect.innerHTML = '<option value="">اختر ميدان</option>';
        taskModuleSelect.innerHTML = '<option value="">اختر مقطع</option>';
        taskActivitySelect.innerHTML = '<option value="">اختر نشاط</option>';
    });

    taskClassSelect.addEventListener('change', () => {
        const level = taskClassSelect.value.split(' ')[0];
        populateFieldSelect(level);
        taskModuleSelect.innerHTML = '<option value="">اختر مقطع</option>';
        taskActivitySelect.innerHTML = '<option value="">اختر نشاط</option>';
    });

    taskFieldSelect.addEventListener('change', () => {
        const level = taskClassSelect.value.split(' ')[0];
        const field = taskFieldSelect.value;
        populateModuleSelect(level, field);
        taskActivitySelect.innerHTML = '<option value="">اختر نشاط</option>';
    });

    taskModuleSelect.addEventListener('change', () => {
        const level = taskClassSelect.value.split(' ')[0];
        const field = taskFieldSelect.value;
        const module = taskModuleSelect.value;
        populateActivitySelect(level, field, module);
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const selectedClass = taskClassSelect.value;
        if (!selectedClass || selectedClass === 'لا توجد حصص في هذا اليوم') {
            alert('يرجى اختيار قسم صحيح');
            return;
        }
        
        const [level, classNumber] = selectedClass.split(' ');
        const notificationDuration = parseInt(taskNotificationDurationInput.value) || 0;
        
        const newTask = {
            text: taskText.value,
            date: taskDateInput.value,
            notificationDuration: notificationDuration,
            alertType: taskAlertTypeSelect.value,
            level: level,
            classNumber: classNumber,
            field: taskFieldSelect.value,
            module: taskModuleSelect.value,
            activity: taskActivitySelect.value,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        taskForm.reset();
        renderTasksList();
    });

    enableNotificationsBtn.addEventListener('click', enableNotifications);

    showAllTasksBtn.addEventListener('click', () => {
        currentTaskFilter = 'all';
        updateActiveFilterButton('all');
        renderTasksList();
    });

    showPendingTasksBtn.addEventListener('click', () => {
        currentTaskFilter = 'pending';
        updateActiveFilterButton('pending');
        renderTasksList();
    });

    showCompletedTasksBtn.addEventListener('click', () => {
        currentTaskFilter = 'completed';
        updateActiveFilterButton('completed');
        renderTasksList();
    });

    const updateActiveFilterButton = (filter) => {
        [showAllTasksBtn, showPendingTasksBtn, showCompletedTasksBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (filter === 'all') showAllTasksBtn.classList.add('active');
        if (filter === 'pending') showPendingTasksBtn.classList.add('active');
        if (filter === 'completed') showCompletedTasksBtn.classList.add('active');
    };

    // --- التهيئة الأولية ---
    const initApp = () => {
        renderScheduleTable();
        renderTasksList();
        
        // تعيين تاريخ اليوم كتاريخ افتراضي
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        taskDateInput.value = formattedDate;
        taskDateInput.dispatchEvent(new Event('change'));
        
        // التحقق من إذن الإشعارات
        if ('Notification' in window && Notification.permission === 'granted') {
            updateNotificationButton(true);
            scheduleNotifications();
        }
        
        // التحقق من حالة الاتصال
        updateConnectionStatus();
    };

    const updateConnectionStatus = () => {
        const statusElement = document.getElementById('connection-status');
        
        if (!navigator.onLine) {
            statusElement.classList.remove('d-none');
            statusElement.textContent = 'أنت تعمل حالياً بدون اتصال بالإنترنت. سيتم مزامنة البيانات عند الاتصال.';
        } else {
            statusElement.classList.add('d-none');
        }
    };

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    // بدء التطبيق
    initApp();
});