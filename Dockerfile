FROM python:3.11
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
RUN ls -la
CMD ["python", "freelance/manage.py", "runserver", "0.0.0.0:8000"]