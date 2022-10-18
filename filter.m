file_name='data1.json'
fid = fopen(file_name); 
raw = fread(fid,inf); 
str = char(raw'); 
fclose(fid); 
val = jsondecode(str);
m=cell2mat(struct2cell(val));
[b,a]=cheby1(1,10,2*50/1297);
freqz(b,a,200);
res1=filter(1000*b,a,m(1,:));
res2=filter(1000*b,a,m(2,:));
res3=filter(1000*b,a,m(3,:));
figure;
x=1:1297
plot(x,res1,x,res2,x,res3);
figure;
stem(fft(res1));
figure;
plot(m(1,:));